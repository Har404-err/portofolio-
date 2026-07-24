# Spec Desain: Perbaikan Music Player dengan Multi-Engine Fallback (Adaptasi Mistra)

## Status
Disetujui (Approved)

## Ringkasan
Memperbaiki komponen `MusicPlayer.tsx` pada portofolio dengan memisahkan logika pencarian dan konversi audio YouTube ke dalam modul helper terpisah (`services/musicApi.ts`). Modul ini mengadaptasi strategi multi-engine fallback dari direktori `mistra` (mengutamakan Convert1s, dengan fallback ke KyioV2 dan NexRay) untuk memastikan penanganan link expired dan keandalan stream audio.

## Architecture & Module Structure

### 1. File Baru: `services/musicApi.ts`
Modul ini bertugas menerima kata kunci pencarian lagu dan mengembalikan objek `TrackResult`.

```ts
export interface TrackResult {
  title: string;
  artist: string;
  src: string;
  image: string;
}
```

#### Utilitas & Engine Chain:
1. **Engine 1: Convert1s API (Primary)**
   - **Search**: `GET https://yt-meta.convert1s.com/search?q={query}` -> mengambil item video pertama.
   - **Init Download**: `POST https://hub.convert1s.com/api/download` dengan payload `{ url, os: 'windows', output: { type: 'audio', format: 'mp3', quality: '128kbps' }, audio: { bitrate: '128k' } }`.
   - **Status Polling**: Lakukan polling `statusUrl` (maksimal 10 retries dengan delay 1.5s) hingga status `completed` atau `downloadUrl` tersedia.
2. **Engine 2: KyioV2 API (Fallback 1)**
   - `GET https://api.kyio.web.id/api/v2/dl/yt-play?apikey=kyio&q={query}` (dengan timeout 5000ms).
3. **Engine 3: NexRay API (Fallback 2)**
   - `GET https://api.nexray.eu.cc/downloader/ytplay?q={query}` (dengan timeout 5000ms).

### 2. Update Komponen: `components/MusicPlayer.tsx`
- Hapus panggil fetch manual ke API tunggal Kyio v1.
- Panggil `searchMusicTrack(query)` dari `services/musicApi.ts`.
- Bersihkan metadata judul lagu (menghapus tag seperti `(Official Video)`, `Official Audio`, `[Lyrics]`, dll).
- Tetap mempertahankan persistensi `localStorage` (`musicPlayerTrack`) dan fallback lagu bawaan (`Black Beatles`).

## Error Handling
- Jika Engine 1 gagal atau polling timeout, otomatis coba Engine 2.
- Jika Engine 2 gagal/timeout, otomatis coba Engine 3.
- Jika semua engine gagal, lemparkan error deskriptif yang ditangkap oleh UI `MusicPlayer.tsx` untuk menampilkan notifikasi pesan error ke pengguna.

## Plan Verifikasi
1. Menjalankan pencarian lagu baru di `MusicPlayer.tsx` dan memastikan lagu terkonversi serta dapat diputar.
2. Menguji fungsionalitas build project dengan `npm run build` untuk memastikannya bebas error TypeScript.
