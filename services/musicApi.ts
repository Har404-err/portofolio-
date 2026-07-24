export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const APIKEY = 'KYIO-APIKEY';

const cleanTitle = (title: string): string => {
  return title
    .replace(/\(Official Video\)|\[Official Video\]|Lyrics|Official Audio|\[Lyrics\]|\(Lyrics\)|Remastered|\(Remastered\)/gi, '')
    .trim()
    .substring(0, 35);
};

// Engine 1: KyioV2 Primary (Ultra Fast & Direct)
async function fetchFromKyioV2(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://api.kyio.web.id/api/v2/dl/yt-play?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    const resultObj = data.result || data.data;
    const song = resultObj?.song;
    const download = resultObj?.download;
    let rawUrl = download?.downloadURL || download?.url || resultObj?.download_url || resultObj?.dl_url;

    if (rawUrl) {
      if (rawUrl.startsWith('/')) {
        rawUrl = `https://api.kyio.web.id${rawUrl}`;
      }
      return {
        title: cleanTitle(song?.title || resultObj?.title || query),
        artist: song?.artist?.name || resultObj?.artist || resultObj?.channel || 'YouTube Artist',
        src: rawUrl,
        image: song?.thumbnail || resultObj?.thumbnail || ''
      };
    }
    return null;
  } catch (e) {
    console.warn('KyioV2 engine error:', e);
    return null;
  }
}

// Engine 2: KyioV1 Fallback
async function fetchFromKyioV1(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://api.kyio.web.id/api/dl/yt-play?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    const resultObj = data.result || data.data;
    const song = resultObj?.song;
    const download = resultObj?.download;
    let rawUrl = download?.downloadURL || download?.url || resultObj?.download_url;

    if (rawUrl) {
      if (rawUrl.startsWith('/')) {
        rawUrl = `https://api.kyio.web.id${rawUrl}`;
      }
      return {
        title: cleanTitle(song?.title || resultObj?.title || query),
        artist: song?.artist?.name || resultObj?.artist || 'YouTube Artist',
        src: rawUrl,
        image: song?.thumbnail || resultObj?.thumbnail || ''
      };
    }
    return null;
  } catch (e) {
    console.warn('KyioV1 engine error:', e);
    return null;
  }
}

// Engine 3: NexRay Fallback
async function fetchFromNexRay(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://api.nexray.eu.cc/downloader/ytplay?q=${encodeURIComponent(query)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.status && data.result && (data.result.download_url || data.result.url)) {
      return {
        title: cleanTitle(data.result.title || query),
        artist: data.result.channel || data.result.artist || 'YouTube Artist',
        src: data.result.download_url || data.result.url,
        image: data.result.thumbnail || ''
      };
    }
    return null;
  } catch (e) {
    console.warn('NexRay engine error:', e);
    return null;
  }
}

export async function searchMusicTrack(query: string): Promise<TrackResult> {
  // 1. Try KyioV2 Primary (with KYIO-APIKEY)
  const res1 = await fetchFromKyioV2(query);
  if (res1 && res1.src) return res1;

  // 2. Try KyioV1 Fallback
  const res2 = await fetchFromKyioV1(query);
  if (res2 && res2.src) return res2;

  // 3. Try NexRay Fallback
  const res3 = await fetchFromNexRay(query);
  if (res3 && res3.src) return res3;

  throw new Error('Gagal memutar lagu. Server audio tidak merespon.');
}
