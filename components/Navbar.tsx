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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className={`mx-auto max-w-5xl w-full flex justify-between items-center transition-all duration-500 px-6 py-3 ${scrolled ? 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-full' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center overflow-hidden">
             <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
          </div>
          <span className="font-bold tracking-tight text-lg">MUH4RHQ</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['About', 'Stack', 'Contact'].map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-medium text-white/50 hover:text-white transition-colors"
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
            className="rounded-full border-white/10 text-white hover:bg-white hover:text-black transition-all px-6 h-10 text-xs font-bold"
          >
            Work with me
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
