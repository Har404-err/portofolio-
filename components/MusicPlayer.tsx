import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lagu Default (sombr - back to friends)
  const [track, setTrack] = useState<Track>({
    title: "back to friends",
    artist: "sombr",
    src: "/audio/default.mp3", // File lokal (Anti-Expired)
    image: "https://i.ytimg.com/vi/c8zq4kAn_O0/hq720.jpg"
  });

  useEffect(() => {
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
  }, [track.src]);

  useEffect(() => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
          audioRef.current.pause();
      }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
        const res = await fetch(`https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (data.status && data.result) {
            const item = data.result;
            // Gunakan Proxy Vercel agar tidak kena CORS
            // const proxyUrl = `/api/proxy?url=${encodeURIComponent(item.download_url)}`;
            
            // Untuk dev local tanpa proxy serverless, kita coba direct link dulu
            // Jika nanti di Vercel error, aktifkan baris proxy di atas
            
            setTrack({
                title: item.title.replace(/\(Official Video\)|Lyrics|Official Audio/gi, '').substring(0, 30),
                artist: item.channel,
                src: item.download_url, 
                image: item.thumbnail
            });
            setIsPlaying(true);
            setShowSearch(false);
            setQuery('');
        } else {
            alert("Lagu tidak ditemukan!");
        }
    } catch (err) {
        console.error("Search Error", err);
        alert("Gagal koneksi API.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      <AnimatePresence>
        {showSearch && (
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-72 shadow-2xl"
            >
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Cari lagu..." 
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-full focus:border-[#d4ff00] focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className="bg-[#d4ff00] text-black rounded-lg px-3 py-2 text-xs font-bold">
                        {loading ? '...' : 'GO'}
                    </button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center overflow-hidden transition-all duration-500 pr-2`}
        style={{ boxShadow: isPlaying ? '0 0 20px rgba(212, 255, 0, 0.2)' : 'none' }}
      >
        <button
          onClick={togglePlay}
          className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center group overflow-hidden rounded-full"
        >
          <motion.img 
            src={track.image} 
            alt="Art"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity ${!isPlaying && 'grayscale'}`}
          />
          <div className="relative z-10 text-[#d4ff00] drop-shadow-md">
            {audioLoading ? (
               <svg className="animate-spin h-5 w-5 text-[#d4ff00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : isPlaying ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M5 3l14 9-14 9V3z" /></svg>
            )}
          </div>
        </button>

        <div className="flex flex-col justify-center whitespace-nowrap ml-3 mr-2 overflow-hidden w-24 md:w-32">
            <span className="text-[10px] font-black uppercase text-[#d4ff00] tracking-wider truncate block w-full">{track.title}</span>
            <span className="text-[9px] text-white/50 font-mono truncate block w-full">{track.artist}</span>
        </div>

        <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${showSearch ? 'text-[#d4ff00]' : 'text-white/50'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;