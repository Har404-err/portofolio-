export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
  query?: string;
}

const API_BASE = 'https://api.kyio.web.id';
const APIKEY = 'KYIO-APIKEY';

const cleanTitle = (title: string): string => {
  return title
    .replace(/\(Official Video\)|\[Official Video\]|Lyrics|Official Audio|\[Lyrics\]|\(Lyrics\)|Remastered|\(Remastered\)|Official Music Video|\(Official Music Video\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 60);
};

const resolveUrl = (url: string): string => {
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  if (/^https?:\/\//i.test(url)) {
    return `${API_BASE}/api/internal/audio-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};

function unwrapPayload(payload: unknown): Record<string, any> {
  let candidate: any = payload;

  for (let depth = 0; depth < 5; depth += 1) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) break;

    if (
      candidate.download_url ||
      candidate.download?.downloadURL ||
      candidate.download?.url ||
      candidate.audio_url ||
      candidate.audio?.url ||
      candidate.song
    ) {
      return candidate;
    }

    const nested = candidate.result ?? candidate.data;
    if (!nested || nested === candidate) break;
    candidate = nested;
  }

  return candidate && typeof candidate === 'object' ? candidate : {};
}

function getAudioUrl(result: Record<string, any>): string | null {
  const rawUrl = result.download_url ||
    result.download?.downloadURL ||
    result.download?.url ||
    result.audio_url ||
    result.audio?.url ||
    result.url;

  return typeof rawUrl === 'string' && rawUrl.trim() ? resolveUrl(rawUrl.trim()) : null;
}

function getImage(result: Record<string, any>): string {
  const image = result.thumbnail ||
    result.song?.thumbnail ||
    result.song?.thumbnails?.[0]?.url ||
    result.image ||
    result.cover;

  return typeof image === 'string' ? image : '';
}

function makeTrack(result: Record<string, any>, query: string, fallbackArtist = 'YouTube'): TrackResult | null {
  const src = getAudioUrl(result);
  if (!src) return null;

  return {
    title: cleanTitle(result.title || result.song?.title || query),
    artist: result.artist || result.song?.artist?.name || fallbackArtist,
    src,
    image: getImage(result),
    query,
  };
}

async function fetchJson(path: string, query: string, timeoutMs: number): Promise<any> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${path}?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

// Engine 1: metadata lengkap dan audio proxy dari KyioAPI.
async function fetchFromYtPlay(query: string): Promise<TrackResult | null> {
  try {
    const payload = await fetchJson('/api/dl/yt-play', query, 12000);
    return makeTrack(unwrapPayload(payload), query);
  } catch (error) {
    console.warn('YtPlay engine error:', error);
    return null;
  }
}

// Engine 2: fallback direct audio dari Spotify/SoundCloud resolver.
async function fetchFromSpotifySc(query: string): Promise<TrackResult | null> {
  try {
    const payload = await fetchJson('/api/dl/spotify-sc', query, 8000);
    const rawItems = (payload as any)?.result ?? (payload as any)?.data ?? payload;
    const item = Array.isArray(rawItems) ? rawItems[0] : rawItems;
    if (!item || typeof item !== 'object') return null;
    return makeTrack(item as Record<string, any>, query, 'SoundCloud');
  } catch (error) {
    console.warn('SpotifySc engine error:', error);
    return null;
  }
}

// Engine 3: endpoint V2 yang dipakai player KyioAPI sebagai last resort.
async function fetchFromYtPlayV2(query: string): Promise<TrackResult | null> {
  try {
    const payload = await fetchJson('/api/downloader/yt-play-v2', query, 12000);
    return makeTrack(unwrapPayload(payload), query);
  } catch (error) {
    console.warn('YtPlayV2 engine error:', error);
    return null;
  }
}

export async function searchMusicTrack(query: string): Promise<TrackResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) throw new Error('Masukkan judul lagu atau nama penyanyi.');

  // Jalankan dua resolver utama bersamaan agar pencarian terasa lebih cepat.
  const [ytResult, scResult] = await Promise.allSettled([
    fetchFromYtPlay(normalizedQuery),
    fetchFromSpotifySc(normalizedQuery),
  ]);

  const yt = ytResult.status === 'fulfilled' ? ytResult.value : null;
  if (yt?.src) return yt;

  const sc = scResult.status === 'fulfilled' ? scResult.value : null;
  if (sc?.src) return sc;

  const v2 = await fetchFromYtPlayV2(normalizedQuery);
  if (v2?.src) return v2;

  throw new Error('Gagal mendapatkan audio. Coba judul lagu lain atau ulangi beberapa saat lagi.');
}
