export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const cleanTitle = (title: string): string => {
  return title
    .replace(/\(Official Video\)|\[Official Video\]|Lyrics|Official Audio|\[Lyrics\]|\(Lyrics\)/gi, '')
    .trim()
    .substring(0, 35);
};

// Engine 1: Convert1s
async function fetchFromConvert1s(query: string): Promise<TrackResult | null> {
  try {
    const searchRes = await fetch(`https://yt-meta.convert1s.com/search?q=${encodeURIComponent(query)}`);
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    
    const firstItem = searchData.items?.[0];
    if (!firstItem || !firstItem.id) return null;

    const initRes = await fetch('https://hub.convert1s.com/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: firstItem.id,
        os: 'windows',
        output: { type: 'audio', format: 'mp3', quality: '128kbps' },
        audio: { bitrate: '128k' }
      })
    });

    if (!initRes.ok) return null;
    const initData = await initRes.json();
    const statusUrl = initData.statusUrl;
    if (!statusUrl) return null;

    // Polling status conversion (max 10 tries with 1.5s delay)
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const statusRes = await fetch(statusUrl);
      if (!statusRes.ok) continue;
      const statusData = await statusRes.json();

      if (statusData.downloadUrl || statusData.url || statusData.status === 'completed') {
        const finalUrl = statusData.downloadUrl || statusData.url;
        if (finalUrl) {
          return {
            title: cleanTitle(firstItem.title),
            artist: firstItem.uploaderName || 'YouTube Artist',
            src: finalUrl,
            image: firstItem.thumbnailUrl || ''
          };
        }
      }
      if (statusData.status === 'failed') break;
    }
    return null;
  } catch (e) {
    console.warn('Convert1s engine error:', e);
    return null;
  }
}

// Engine 2: KyioV2
async function fetchFromKyioV2(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://api.kyio.web.id/api/v2/dl/yt-play?apikey=kyio&q=${encodeURIComponent(query)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.status && data.result && (data.result.download_url || data.result.dl_url)) {
      return {
        title: cleanTitle(data.result.title || query),
        artist: data.result.artist || data.result.channel || 'YouTube Artist',
        src: data.result.download_url || data.result.dl_url,
        image: data.result.thumbnail || ''
      };
    }
    return null;
  } catch (e) {
    console.warn('KyioV2 engine error:', e);
    return null;
  }
}

// Engine 3: NexRay
async function fetchFromNexRay(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
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
  // Try Engine 1: Convert1s
  const res1 = await fetchFromConvert1s(query);
  if (res1 && res1.src) return res1;

  // Try Engine 2: KyioV2
  const res2 = await fetchFromKyioV2(query);
  if (res2 && res2.src) return res2;

  // Try Engine 3: NexRay
  const res3 = await fetchFromNexRay(query);
  if (res3 && res3.src) return res3;

  throw new Error('Gagal mendapatkan lagu dari seluruh server audio.');
}
