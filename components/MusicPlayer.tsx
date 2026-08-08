import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { searchMusicTrack, TrackResult } from '../services/musicApi';

type Track = TrackResult & { query?: string };

const DEFAULT_TRACK: Track = {
  title: 'Black Beatles',
  artist: 'Rae Sremmurd feat. Gucci Mane',
  src: '/audio/black-beatles.mp3',
  image: '/audio/black-beatles.jpg',
  query: 'Black Beatles Rae Sremmurd',
};

const STORAGE_KEY = 'musicPlayerTrack';
const QUEUE_KEY = 'musicPlayerQueue';
const VOLUME_KEY = 'musicPlayerVolume';

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

function Icon({ name, size = 16 }: { name: 'play' | 'pause' | 'search' | 'close' | 'next' | 'prev' | 'list' | 'volume'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'play') return <svg {...common} fill="currentColor" stroke="none"><path d="M7 4.5v15l12-7.5-12-7.5Z" /></svg>;
  if (name === 'pause') return <svg {...common} fill="currentColor" stroke="none"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>;
  if (name === 'search') return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'next') return <svg {...common} fill="currentColor" stroke="none"><path d="M5 4.5v15l10-7.5-10-7.5ZM17 4h2v16h-2z" /></svg>;
  if (name === 'prev') return <svg {...common} fill="currentColor" stroke="none"><path d="m19 4.5-10 7.5 10 7.5v-15ZM5 4h2v16H5z" /></svg>;
  if (name === 'list') return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
  return <svg {...common}><path d="M11 5 6 9H3v6h3l5 4V5ZM19 9a5 5 0 0 1 0 6M16.5 11.5a2 2 0 0 1 0 1" /></svg>;
}

const MusicPlayer: React.FC = () => {
  const [track, setTrack] = useState<Track>(DEFAULT_TRACK);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentTrackRef = useRef(track);
  const queueRef = useRef(queue);
  const recoveryRef = useRef(false);
  const recoveryTrackRef = useRef('');
  const autoplayRequestedRef = useRef(false);

  useEffect(() => { currentTrackRef.current = track; }, [track]);
  useEffect(() => { queueRef.current = queue; }, [queue]);

  const playTrack = useCallback(async (nextTrack: Track, autoplay = true) => {
    const audio = audioRef.current;
    if (!audio || !nextTrack.src) return;

    currentTrackRef.current = nextTrack;
    setTrack(nextTrack);
    setError('');
    setLoading(true);
    audio.src = nextTrack.src;
    audio.load();

    if (!autoplay) {
      setLoading(false);
      return;
    }

    try {
      await audio.play();
      recoveryTrackRef.current = '';
      autoplayRequestedRef.current = false;
      setIsPlaying(true);
    } catch (playError) {
      setIsPlaying(false);
      setLoading(false);
      if ((playError as DOMException)?.name === 'NotAllowedError') {
        autoplayRequestedRef.current = true;
      } else {
        setError('Audio belum bisa diputar. Tekan tombol play untuk mencoba lagi.');
      }
    }
  }, []);

  const recoverCurrentTrack = useCallback(async () => {
    const current = currentTrackRef.current;
    const recoveryQuery = current.query || `${current.title} ${current.artist}`;
    if (!recoveryQuery.trim() || recoveryRef.current) return;

    const recoveryKey = `${current.title}|${current.artist}`;
    if (recoveryTrackRef.current === recoveryKey) return;
    recoveryTrackRef.current = recoveryKey;
    recoveryRef.current = true;
    setLoading(true);
    try {
      const freshTrack = await searchMusicTrack(recoveryQuery);
      await playTrack(freshTrack, true);
    } catch {
      setLoading(false);
      setIsPlaying(false);
      setError('Stream lagu sudah kedaluwarsa. Coba cari lagu ini lagi.');
    } finally {
      recoveryRef.current = false;
    }
  }, [playTrack]);

  // Satu elemen audio dipakai sepanjang hidup komponen, seperti player KyioAPI.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = readStorage<number>(VOLUME_KEY, 0.5);
    audioRef.current = audio;
    setVolume(audio.volume);

    const onPlaying = () => { setIsPlaying(true); setLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onError = () => {
      setLoading(false);
      setIsPlaying(false);
      void recoverCurrentTrack();
    };
    const onEnded = () => {
      const [next, ...rest] = queueRef.current;
      if (next) {
        setQueue(rest);
        if (next.src) {
          void playTrack(next, true);
        } else {
          setLoading(true);
          void searchMusicTrack(next.query || `${next.title} ${next.artist}`)
            .then((freshTrack) => playTrack(freshTrack, true))
            .catch(() => {
              setLoading(false);
              setError('Gagal memuat lagu berikutnya.');
            });
        }
      } else {
        audio.currentTime = 0;
        setProgress(0);
        // Loop lagu bawaan/current track tanpa membuat elemen audio baru.
        void audio.play().catch(() => setIsPlaying(false));
      }
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMetadata);
    audio.addEventListener('durationchange', onMetadata);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    const savedTrack = readStorage<Track>(STORAGE_KEY, DEFAULT_TRACK);
    const savedQueue = readStorage<Track[]>(QUEUE_KEY, []);
    const savedVolume = readStorage<number>(VOLUME_KEY, 0.5);
    if (savedTrack?.src) {
      currentTrackRef.current = savedTrack;
      setTrack(savedTrack);
      audio.src = savedTrack.src;
      audio.volume = Math.max(0, Math.min(1, savedVolume));
      setVolume(audio.volume);
    }
    if (Array.isArray(savedQueue)) {
      setQueue(savedQueue
        .filter((item) => item?.title && (item?.query || item?.src))
        .map((item) => ({ ...item, src: '' })));
    }

    return () => {
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMetadata);
      audio.removeEventListener('durationchange', onMetadata);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, [playTrack, recoverCurrentTrack]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(track));
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      // Private browsing atau storage penuh tidak boleh merusak playback.
    }
  }, [track, queue, volume]);

  useEffect(() => {
    if (showSearch) window.setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [showSearch]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        if (!audio.src) {
          await recoverCurrentTrack();
          return;
        }
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      await recoverCurrentTrack();
    }
  }, [recoverCurrentTrack]);

  useEffect(() => {
    const retryAutoplay = () => {
      if (!autoplayRequestedRef.current || !audioRef.current?.paused) return;
      autoplayRequestedRef.current = false;
      void togglePlay();
    };
    const events = ['pointerdown', 'keydown', 'touchstart'] as const;
    events.forEach((event) => window.addEventListener(event, retryAutoplay, { passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, retryAutoplay));
  }, [togglePlay]);

  const handleSearch = async (event: React.FormEvent | React.MouseEvent, addToQueue = false) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery || loading) return;

    setLoading(true);
    setError('');
    try {
      const result = await searchMusicTrack(normalizedQuery);
      if (addToQueue) {
        // Simpan metadata/query saja; URL resolver dapat kedaluwarsa sebelum diputar.
        setQueue((previous) => [...previous, { ...result, src: '', query: normalizedQuery }]);
        setLoading(false);
      } else {
        await playTrack(result, true);
      }
      setQuery('');
      setShowSearch(false);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Gagal mencari lagu.');
      setLoading(false);
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(duration, ((event.clientX - rect.left) / rect.width) * duration));
    setProgress(audio.currentTime);
  };

  const handleSeekKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const step = event.shiftKey ? 10 : 5;
    let nextTime = audio.currentTime;
    if (event.key === 'ArrowRight') nextTime += step;
    else if (event.key === 'ArrowLeft') nextTime -= step;
    else if (event.key === 'Home') nextTime = 0;
    else if (event.key === 'End') nextTime = duration;
    else return;
    event.preventDefault();
    audio.currentTime = Math.max(0, Math.min(duration, nextTime));
    setProgress(audio.currentTime);
  };

  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume;
  };

  const skipNext = useCallback(() => {
    const [next, ...rest] = queueRef.current;
    if (!next) return;
    setQueue(rest);
    if (next.src) {
      void playTrack(next, true);
      return;
    }
    setLoading(true);
    void searchMusicTrack(next.query || `${next.title} ${next.artist}`)
      .then((freshTrack) => playTrack(freshTrack, true))
      .catch(() => {
        setLoading(false);
        setError('Gagal memuat lagu berikutnya.');
      });
  }, [playTrack]);

  const restart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    if (audioRef.current.paused) void togglePlay();
  }, [togglePlay]);

  // Kontrol media OS (headset, lock screen, notification) mengikuti player KyioAPI.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: track.image ? [{ src: track.image, sizes: '512x512', type: 'image/jpeg' }] : [],
    });
    navigator.mediaSession.setActionHandler('play', () => void togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => void togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', restart);
    navigator.mediaSession.setActionHandler('nexttrack', skipNext);
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [track, togglePlay, restart, skipNext]);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="w-[calc(100vw-2rem)] sm:w-80 max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-accent shadow-[0_0_8px_currentColor]' : 'bg-white/20'}`} />
                {isPlaying ? 'Now playing' : 'Paused'}
              </span>
              <button type="button" onClick={() => setIsExpanded(false)} aria-label="Tutup music player" className="rounded-lg p-1 text-white/30 transition hover:bg-white/10 hover:text-white"><Icon name="close" size={14} /></button>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <motion.img
                src={track.image || '/audio/black-beatles.jpg'}
                alt="Cover lagu"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className={`h-14 w-14 rounded-full border border-white/10 object-cover shadow-xl ${!isPlaying ? 'grayscale opacity-60' : ''}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{track.title}</p>
                <p className="truncate text-[11px] text-white/40">{track.artist}</p>
              </div>
            </div>

            <div className="mb-1 cursor-pointer" onClick={seek} onKeyDown={handleSeekKeyDown} role="slider" aria-label="Posisi lagu" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={progress} tabIndex={0}>
              <div className="group relative h-1 rounded-full bg-white/10 transition hover:h-1.5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
                <div className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100" style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="mb-3 flex justify-between text-[10px] tabular-nums text-white/30"><span>{formatTime(progress)}</span><span>{formatTime(duration)}</span></div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <button type="button" onClick={restart} aria-label="Mulai ulang lagu" className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"><Icon name="prev" size={14} /></button>
              <button type="button" onClick={() => void togglePlay()} aria-label={isPlaying ? 'Pause lagu' : 'Putar lagu'} disabled={loading} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-accent disabled:opacity-50">{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <Icon name={isPlaying ? 'pause' : 'play'} size={16} />}</button>
              <button type="button" onClick={skipNext} aria-label="Lagu berikutnya" disabled={!queue.length || loading} className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-20"><Icon name="next" size={14} /></button>
              <button type="button" onClick={() => setShowSearch((value) => !value)} aria-label="Cari lagu" className={`ml-1 rounded-full p-2 transition hover:bg-white/10 ${showSearch ? 'text-accent' : 'text-white/40'}`}><Icon name="search" size={14} /></button>
              <button type="button" onClick={() => setShowQueue((value) => !value)} aria-label="Buka antrean lagu" className={`relative rounded-full p-2 transition hover:bg-white/10 ${showQueue ? 'text-accent' : 'text-white/40'}`}><Icon name="list" size={14} />{queue.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-black">{queue.length}</span>}</button>
            </div>

            <div className="mb-1 flex items-center gap-2 text-white/40"><Icon name="volume" size={13} /><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="Volume" className="h-1 w-full accent-accent" /></div>

            <AnimatePresence>
              {showSearch && (
                <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} onSubmit={(event) => void handleSearch(event)} className="mt-3 overflow-hidden border-t border-white/[0.06] pt-3">
                  <div className="flex gap-2"><div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5"><Icon name="search" size={13} /><input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Artis atau judul lagu..." className="min-w-0 flex-1 bg-transparent py-2 text-xs text-white outline-none placeholder:text-white/25" disabled={loading} /></div><button type="submit" disabled={!query.trim() || loading} className="rounded-lg bg-accent px-3 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-30">Play</button></div>
                  <button type="button" onClick={(event) => { void handleSearch(event, true); }} disabled={!query.trim() || loading} className="mt-2 w-full rounded-lg border border-white/10 py-2 text-[10px] font-bold uppercase tracking-widest text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-30">+ Tambah ke antrean</button>
                </motion.form>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showQueue && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 overflow-hidden border-t border-white/[0.06] pt-3">
                  <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Antrean</span>{queue.length > 0 && <button type="button" onClick={() => setQueue([])} className="text-[10px] text-white/30 hover:text-white">Hapus semua</button>}</div>
                  {queue.length === 0 ? <p className="py-3 text-center text-[11px] text-white/25">Antrean masih kosong.</p> : <div className="max-h-36 space-y-1 overflow-y-auto">{queue.map((item, index) => <div key={`${item.query || item.title}-${index}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"><span className="w-4 text-center text-[10px] text-white/25">{index + 1}</span><img src={item.image || '/audio/black-beatles.jpg'} alt="" className="h-7 w-7 rounded object-cover" /><span className="min-w-0 flex-1 truncate text-[11px] text-white/70">{item.title}</span><button type="button" onClick={() => setQueue((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Hapus ${item.title}`} className="text-white/25 hover:text-white"><Icon name="close" size={12} /></button></div>)}</div>}
                </motion.div>
              )}
            </AnimatePresence>
            {error && <p role="status" className="mt-3 border-t border-red-400/10 pt-2 text-[10px] leading-relaxed text-red-300/80">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="flex items-center overflow-hidden rounded-full border border-white/10 bg-[#0a0a0a]/85 pr-1.5 shadow-2xl backdrop-blur-xl" style={{ boxShadow: isPlaying ? '0 0 24px rgba(0, 242, 254, 0.25)' : undefined }}>
        <button type="button" onClick={() => void togglePlay()} aria-label={isPlaying ? 'Pause lagu' : 'Putar lagu'} className="group relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full"><img src={track.image || '/audio/black-beatles.jpg'} alt="Cover lagu" className={`absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-40 ${!isPlaying ? 'grayscale' : ''}`} /><span className="relative z-10 text-accent">{loading ? <span className="block h-5 w-5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" /> : <Icon name={isPlaying ? 'pause' : 'play'} size={16} />}</span></button>
        <button type="button" onClick={() => setIsExpanded((value) => !value)} aria-label="Buka detail music player" className="min-w-0 flex-1 px-3 text-left"><span className="block max-w-32 truncate text-[10px] font-black uppercase tracking-wider text-accent">{track.title}</span><span className="block max-w-32 truncate font-mono text-[9px] text-white/50">{track.artist}</span></button>
        <button type="button" onClick={() => { setShowSearch((value) => !value); setIsExpanded(true); }} aria-label="Cari lagu" className={`rounded-full p-2 transition hover:bg-white/10 ${showSearch ? 'text-accent' : 'text-white/50'}`}><Icon name="search" size={15} /></button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
