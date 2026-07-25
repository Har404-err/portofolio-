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

// Helper: Extract video ID from youtube URL or string
function extractVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  const match = urlOrId.match(/(?:v=|\/vi\/|youtu\.be\/|\/v\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Engine 1: YouTube Search Metadata + Kyio yt-mp3 Direct Stream (Super Fast & Reliable)
async function fetchViaYtMp3(query: string): Promise<TrackResult | null> {
  try {
    let meta: { title: string; uploaderName?: string; thumbnailUrl?: string; id: string } | null = null;
    let videoId: string | null = null;

    // Search video info via Convert1s Search API
    const searchRes = await fetch(`https://yt-meta.convert1s.com/search?q=${encodeURIComponent(query)}`);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const first = searchData.items?.[0];
      if (first) {
        meta = first;
        videoId = extractVideoId(first.id);
      }
    }

    if (videoId) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const mp3Res = await fetch(`https://api.kyio.web.id/api/v2/dl/yt-mp3?id=${videoId}&apikey=${APIKEY}`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (mp3Res.ok) {
        const mp3Data = await mp3Res.json();
        const directLink = mp3Data.result?.link || mp3Data.link || mp3Data.result?.download_url;
        if (directLink && directLink.startsWith('http')) {
          return {
            title: cleanTitle(meta?.title || query),
            artist: meta?.uploaderName || 'YouTube Artist',
            src: directLink,
            image: meta?.thumbnailUrl || ''
          };
        }
      }
    }
    return null;
  } catch (e) {
    console.warn('YtMp3 Engine error:', e);
    return null;
  }
}

// Engine 2: Convert1s Direct Download Engine
async function fetchViaConvert1s(query: string): Promise<TrackResult | null> {
  try {
    const searchRes = await fetch(`https://yt-meta.convert1s.com/search?q=${encodeURIComponent(query)}`);
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const first = searchData.items?.[0];
    if (!first || !first.id) return null;

    const initRes = await fetch('https://hub.convert1s.com/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: first.id,
        os: 'windows',
        output: { type: 'audio', format: 'mp3', quality: '128kbps' },
        audio: { bitrate: '128k' }
      })
    });

    if (!initRes.ok) return null;
    const initData = await initRes.json();
    if (!initData.statusUrl) return null;

    for (let i = 0; i < 8; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const stRes = await fetch(initData.statusUrl);
      if (!stRes.ok) continue;
      const stData = await stRes.json();
      if (stData.downloadUrl && stData.downloadUrl.startsWith('http')) {
        return {
          title: cleanTitle(first.title),
          artist: first.uploaderName || 'YouTube Artist',
          src: stData.downloadUrl,
          image: first.thumbnailUrl || ''
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('Convert1s Engine error:', e);
    return null;
  }
}

// Engine 3: Kyio Spotify/SoundCloud Fallback
async function fetchViaSpotifySc(query: string): Promise<TrackResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://api.kyio.web.id/api/v2/dl/spotify-sc?q=${encodeURIComponent(query)}&apikey=${APIKEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const items = data.result || data.data;

    if (Array.isArray(items) && items[0]?.url && items[0].url.startsWith('http')) {
      return {
        title: cleanTitle(query),
        artist: 'Spotify / SoundCloud',
        src: items[0].url,
        image: ''
      };
    }
    return null;
  } catch (e) {
    console.warn('SpotifySc Engine error:', e);
    return null;
  }
}

export async function searchMusicTrack(query: string): Promise<TrackResult> {
  // 1. Primary Engine: YouTube Search + Kyio yt-mp3 Direct Stream
  const res1 = await fetchViaYtMp3(query);
  if (res1 && res1.src) return res1;

  // 2. Secondary Engine: Convert1s Direct Download
  const res2 = await fetchViaConvert1s(query);
  if (res2 && res2.src) return res2;

  // 3. Fallback Engine: Kyio spotify-sc Direct MP3
  const res3 = await fetchViaSpotifySc(query);
  if (res3 && res3.src) return res3;

  throw new Error('Gagal memutar lagu. Server audio tidak merespon.');
}
