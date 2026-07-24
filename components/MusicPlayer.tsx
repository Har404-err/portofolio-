import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMusicTrack } from '../services/musicApi';

// Tipe data untuk Track
interface Track {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi track dari localStorage atau gunakan lagu default Black Beatles
  const [track, setTrack] = useState<Track | null>(() => {
    try {
      const saved = localStorage.getItem('musicPlayerTrack');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse cached track");
    }
    return {
      title: "Black Beatles",
      artist: "Rae Sremmurd feat. Gucci Mane",
      src: "/audio/black-beatles.mp3",
      image: "/audio/black-beatles.jpg"
    };
  });

  // Simpan track ke localStorage setiap kali berubah
  useEffect(() => {
    if (track) {
      localStorage.setItem('musicPlayerTrack', JSON.stringify(track));
    } else {
      localStorage.removeItem('musicPlayerTrack');
    }
  }, [track]);

  useEffect(() => {
    if (!track) return;

    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }

    const audio = new Audio(track.src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const handleCanPlay = () => {
        setAudioLoading(false);
        if (isPlaying) {
            audio.play().catch(e => {
                console.warn("Autoplay blocked:", e);
                setIsPlaying(false);
            });
        }
    };

    const handleLoadStart = () => setAudioLoading(true);
    const handleError = (e: any) => {
        console.error("Audio Error:", e);
        setAudioLoading(false);
        setIsPlaying(false);
        alert("Gagal memutar audio. Link mungkin expired.");
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    return () => {
        audio.pause();
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('error', handleError);
    };
  }, [track?.src]);

  useEffect(() => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
          audioRef.current.pause();
      }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!track) {
      setShowSearch(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
      // ponytail: Fallback multi-engine (Convert1s -> KyioV2 -> NexRay). Upgrade path: Add websocket/server proxy for faster stream.
      const newTrack = await searchMusicTrack(query);
      setTrack(newTrack);
      setIsPlaying(true);
      setShowSearch(false);
      setQuery('');
    } catch (err: any) {
      console.error("Search Error", err);
      alert(err.message || "Gagal memutar lagu dari server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-4">
      <AnimatePresence>
        {showSearch && (
            <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-[#121212]/95 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-xl w-[calc(100vw-2rem)] sm:w-80 max-w-xs shadow-2xl flex flex-col gap-3"
            >
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Search Audio</span>
                    <button 
                        type="button"
                        onClick={() => setShowSearch(false)}
                        aria-label="Tutup pencarian"
                        className="text-white/40 hover:text-white text-xs transition-colors p-1"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 text-white/30 pointer-events-none">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            aria-label="Cari lagu di YouTube"
                            placeholder="Judul lagu / penyanyi..." 
                            className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-7 py-2 text-xs text-white w-full placeholder:text-white/30 focus:border-accent/60 focus:bg-white/[0.07] focus:outline-none transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-2 text-white/30 hover:text-white text-xs p-1"
                                aria-label="Hapus teks"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !query.trim()} 
                        aria-label="Cari lagu" 
                        className="bg-accent text-black rounded-lg px-3.5 py-2 text-xs font-semibold hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100 transition-all flex items-center gap-1.5 shrink-0"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Cari...</span>
                            </>
                        ) : (
                            <span>Cari</span>
                        )}
                    </button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center overflow-hidden transition-all duration-500 pr-2`}
        style={{ boxShadow: isPlaying ? '0 0 20px accent-glow' : 'none' }}
      >
        <button
          onClick={togglePlay}
          aria-label={!track ? "Pilih lagu" : isPlaying ? "Pause lagu" : "Putar lagu"}
          className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center group overflow-hidden rounded-full"
        >
          <motion.img 
            src={track?.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop'} 
            alt="Art"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity ${!isPlaying && 'grayscale'}`}
          />
          <div className="relative z-10 text-accent drop-shadow-md">
            {audioLoading ? (
               <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : isPlaying ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M5 3l14 9-14 9V3z" /></svg>
            )}
          </div>
        </button>

        <div className="flex flex-col justify-center whitespace-nowrap ml-3 mr-2 overflow-hidden w-24 md:w-32">
            <span className="text-[10px] font-black uppercase text-accent tracking-wider truncate block w-full">{track ? track.title : "No Track"}</span>
            <span className="text-[9px] text-white/50 font-mono truncate block w-full">{track ? track.artist : "Search to play"}</span>
        </div>

        <button 
            onClick={() => {
               setShowSearch(!showSearch);
               if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            aria-label="Toggle pencarian lagu"
            aria-expanded={showSearch}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${showSearch ? 'text-accent' : 'text-white/50'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;