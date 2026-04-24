import React, { useState, useEffect } from 'react';
import { Button, Link } from "@heroui/react";
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}>
      <div className={`mx-auto max-w-7xl w-full flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 shadow-[0_0_20px_rgba(0,240,255,0.15)]' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <a href="#" className="font-jakarta text-xl md:text-2xl font-black tracking-tighter interactive text-white uppercase">
            MUH4RHQ<span className="text-primary">&gt;</span>
          </a>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-12">
          {['About', 'Stack', 'Contact'].map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[11px] uppercase tracking-[0.5em] font-black text-white/50 hover:text-primary transition-all interactive"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            as="a"
            href="#contact" 
            variant="flat" 
            color="primary"
            size="sm"
            className="font-black text-[10px] uppercase tracking-widest rounded-full px-6 h-10"
          >
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
