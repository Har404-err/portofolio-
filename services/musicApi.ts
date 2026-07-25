export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const API_BASE = 'https://api.kyio.web.id';
const APIKEY = 'KYIO-APIKEY';

const cleanTitle = (title: string): string => {
  return title
    .replace(/\(Official Video\)|\[Official Video\]|Lyrics|Official Audio|\[Lyrics\]|\(Lyrics\)|Remastered|\(Remastered\)|Official Music Video|\(Official Music Video\)/gi, '')
    .trim()
    .substring(0, 40);
};

const resolveUrl = (url: string): string => {
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};

// Engine 1: KyioAPI /api/dl/yt-play — Rich metadata + audio proxy stream
async function fetchFromYtPlay(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${API_BASE}/api/dl/yt-play?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    const result = data.result || data.data;
    const song = result?.song;
    const download = result?.download;
    const rawUrl = download?.downloadURL || download?.url;

    if (rawUrl) {
      return {
        title: cleanTitle(song?.title || query),
        artist: song?.artist?.name || 'YouTube',
        src: resolveUrl(rawUrl),
        image: song?.thumbnail || ''
      };
    }
    return null;
  } catch (e) {
    console.warn('YtPlay engine error:', e);
    return null;
  }
}

// Engine 2: KyioAPI /api/dl/spotify-sc — Direct MP3 URL (no proxy needed)
async function fetchFromSpotifySc(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE}/api/dl/spotify-sc?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    const items = data.result || data.data;
    if (Array.isArray(items) && items[0]?.url && items[0].url.startsWith('http')) {
      return {
        title: cleanTitle(query),
        artist: 'SoundCloud',
        src: items[0].url,
        image: ''
      };
    }
    return null;
  } catch (e) {
    console.warn('SpotifySc engine error:', e);
    return null;
  }
}

// Engine 3: KyioAPI /api/v2/dl/yt-play — V2 fallback with proxy stream
async function fetchFromYtPlayV2(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${API_BASE}/api/v2/dl/yt-play?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    const result = data.result || data.data;
    const song = result?.song;
    const download = result?.download;
    const rawUrl = download?.downloadURL || download?.url || result?.download_url;

    if (rawUrl) {
      return {
        title: cleanTitle(song?.title || result?.title || query),
        artist: song?.artist?.name || result?.artist || 'YouTube',
        src: resolveUrl(rawUrl),
        image: song?.thumbnail || result?.thumbnail || ''
      };
    }
    return null;
  } catch (e) {
    console.warn('YtPlayV2 engine error:', e);
    return null;
  }
}

export async function searchMusicTrack(query: string): Promise<TrackResult> {
  // Run Engine 1 (yt-play) and Engine 2 (spotify-sc) in parallel for speed
  const [ytResult, scResult] = await Promise.allSettled([
    fetchFromYtPlay(query),
    fetchFromSpotifySc(query)
  ]);

  // Prefer yt-play (has metadata: title, artist, thumbnail)
  const yt = ytResult.status === 'fulfilled' ? ytResult.value : null;
  if (yt && yt.src) return yt;

  // Fallback to spotify-sc (direct MP3, less metadata)
  const sc = scResult.status === 'fulfilled' ? scResult.value : null;
  if (sc && sc.src) return sc;

  // Last resort: yt-play v2
  const v2 = await fetchFromYtPlayV2(query);
  if (v2 && v2.src) return v2;

  throw new Error('Gagal memutar lagu. Coba lagi nanti.');
}
