import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -50]);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-white/10">
      {/* Blocky background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <motion.div 
        style={{ opacity, y }}
        className="text-center z-10 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase font-bold tracking-[0.3em] mb-12"
        >
          <div className="w-2 h-2 bg-white"></div>
          Status: Operational
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.85] uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Building <br /> The <span className="text-white/20">Core</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm md:text-base text-white/40 font-bold max-w-xl mx-auto mb-16 leading-relaxed uppercase tracking-widest"
        >
          Architecting High-Performance API Infrastructure & Advanced Automation Logic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-1"
        >
          <a href="#contact" className="btn-shiny px-12 h-14 uppercase tracking-[0.2em] text-xs">
            Initiate Contact
            <ArrowRight className="ml-3 w-4 h-4" />
          </a>
          <a href="#stack" className="h-14 px-12 border border-white/10 flex items-center gap-3 text-white/50 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
            Inventory
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative center beam */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-white/20 to-transparent"></div>
    </section>
  );
};

export default Hero;
