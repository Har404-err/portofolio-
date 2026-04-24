import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Search, Loader2 } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [track, setTrack] = useState<Track>({
    title: "back to friends",
    artist: "sombr",
    src: "/audio/default.mp3",
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
            setTrack({
                title: item.title.replace(/\(Official Video\)|Lyrics|Official Audio/gi, '').substring(0, 30),
                artist: item.channel,
                src: item.download_url, 
                image: item.thumbnail
            });
            setIsPlaying(true);
            setShowSearch(false);
            setQuery('');
        }
    } catch (err) {
        console.error("Search Error", err);
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
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-72 p-4 shadow-2xl backdrop-blur-xl"
            >
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="Search track..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-white/5 text-white text-sm p-3 flex-grow rounded-xl outline-none border border-white/5 focus:border-white/20 transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="p-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center p-2 gap-4 shadow-xl"
      >
        <button
            className="w-10 h-10 flex-shrink-0 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            onClick={togglePlay}
        >
            {audioLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
            ) : isPlaying ? (
                <Pause fill="currentColor" size={16} />
            ) : (
                <Play fill="currentColor" size={16} className="ml-0.5" />
            )}
        </button>

        <div className="flex flex-col justify-center whitespace-nowrap overflow-hidden w-24 md:w-32">
            <span className="text-[10px] font-bold uppercase text-white truncate tracking-wider">{track.title}</span>
            <span className="text-[9px] text-white/40 truncate mt-0.5 uppercase tracking-tighter">{track.artist}</span>
        </div>

        <button
            className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-white/10 transition-all ${showSearch ? 'text-white' : 'text-white/20'}`}
            onClick={() => setShowSearch(!showSearch)}
        >
            <Search size={14} />
        </button>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
