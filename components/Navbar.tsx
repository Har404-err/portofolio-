import React, { useState, useEffect } from 'react';
import { Button } from "@heroui/react";
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-0' : 'py-4'}`}>
      <div className={`mx-auto max-w-5xl w-full flex justify-between items-center transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-x border-b border-white/10' : 'border-b border-white/5'}`}>
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-white flex items-center justify-center overflow-hidden">
             <div className="w-3 h-3 bg-black animate-pulse"></div>
          </div>
          <span className="font-bold tracking-tighter text-xl">MUH4RHQ</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['About', 'Stack', 'Contact'].map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            as="a"
            href="#contact" 
            variant="bordered"
            className="rounded-none border-white/20 text-white hover:bg-white hover:text-black transition-all px-6 h-11 text-[10px] font-bold uppercase tracking-widest"
          >
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
