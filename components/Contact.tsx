import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Code2, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden bg-black">
      <div className="container mx-auto max-w-5xl">
        <div className="bento-card bg-white text-black border-none flex flex-col md:flex-row items-center justify-between gap-12 p-16 md:p-24 relative overflow-hidden">
          {/* Decorative blocky corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-black border-l border-b border-white/10 flex items-center justify-center">
             <div className="w-4 h-4 bg-white/20"></div>
          </div>

          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-[0.9]">
              Engineering <br /> Collaboration.
            </h2>
            <p className="text-black/50 text-sm font-bold mb-12 uppercase tracking-widest leading-relaxed">
              Accepting high-priority requests for API development, 
              logic automation, and systems architecture.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-px bg-black/10 border border-black/5 p-1">
               <a href="https://wa.me/6282148570591" target="_blank" className="flex items-center gap-3 px-8 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-black/90 transition-all">
                  <MessageCircle size={14} />
                  WhatsApp_Link
               </a>
               <a href="https://github.com/Har404-err" target="_blank" className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest border border-black/10 hover:bg-black/5 transition-colors">
                  <Code2 size={14} />
                  Source_Repo
               </a>
            </div>
          </div>
          
          <div className="hidden lg:block">
             <div className="w-56 h-56 border-4 border-black flex flex-col items-center justify-center p-8 gap-4">
                <div className="w-full h-px bg-black/20"></div>
                <div className="w-full h-px bg-black/20"></div>
                <div className="w-full h-px bg-black/20"></div>
                <div className="w-full h-px bg-black/20"></div>
             </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-1">
           <div className="text-center md:text-left p-10 border border-white/5 bg-white/[0.02]">
              <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.4em] mb-4">Email_Channel</p>
              <a href="mailto:abdulmuhar564@gmail.com" className="text-sm font-bold text-white uppercase tracking-tighter hover:text-white/70 transition-colors">abdulmuhar564@gmail.com</a>
           </div>
           <div className="text-center md:text-left p-10 border border-white/5 bg-white/[0.02]">
              <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.4em] mb-4">Base_Station</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Pontianak, ID</p>
           </div>
           <div className="text-center md:text-left p-10 border border-white/5 bg-white/[0.02]">
              <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.4em] mb-4">System_Status</p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">Ready_for_Deployment</p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
