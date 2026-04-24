import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button, 
  Input, 
  Tooltip,
  Card,
  CardContent
} from "@heroui/react";
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
            >
                <Card className="bg-background/80 backdrop-blur-xl border border-white/10 w-72 shadow-2xl">
                    <CardContent className="p-3">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input 
                                size="sm"
                                placeholder="Cari lagu..." 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                classNames={{
                                    inputWrapper: "bg-white/5 border-white/10 group-data-[focus=true]:border-primary",
                                }}
                            />
                            <Button 
                                isIconOnly
                                size="sm"
                                color="primary" 
                                type="submit" 
                                isLoading={loading}
                            >
                                <Search size={16} />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center p-1.5 transition-all duration-500"
        style={{ boxShadow: isPlaying ? '0 0 30px rgba(0, 240, 255, 0.2)' : 'none' }}
      >
        <Tooltip content={isPlaying ? "Pause" : "Play"}>
            <Button
                isIconOnly
                radius="full"
                className="relative w-12 h-12 flex-shrink-0 bg-transparent overflow-hidden"
                onClick={togglePlay}
            >
                <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <img 
                        src={track.image} 
                        alt="Art"
                        className={`w-full h-full object-cover opacity-60 ${!isPlaying && 'grayscale'}`}
                    />
                </motion.div>
                <div className="relative z-10 text-primary drop-shadow-lg">
                    {audioLoading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : isPlaying ? (
                        <Pause fill="currentColor" size={18} />
                    ) : (
                        <Play fill="currentColor" size={18} className="ml-1" />
                    )}
                </div>
            </Button>
        </Tooltip>

        <div className="flex flex-col justify-center whitespace-nowrap ml-4 mr-2 overflow-hidden w-24 md:w-32">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider truncate">{track.title}</span>
            <span className="text-[9px] text-white/50 font-mono truncate">{track.artist}</span>
        </div>

        <Tooltip content="Cari Lagu">
            <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className={`${showSearch ? 'text-primary' : 'text-white/30'}`}
                onClick={() => setShowSearch(!showSearch)}
            >
                <Search size={18} />
            </Button>
        </Tooltip>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
