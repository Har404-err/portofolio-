import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Cpu, Globe, ArrowUpRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Main Intro Card */}
          <div className="md:col-span-4 md:row-span-1 bento-card flex flex-col justify-between group bg-white/5">
            <div className="flex justify-between items-start">
               <div className="p-4 bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <Terminal className="w-6 h-6" />
               </div>
               <div className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/30">Module_01</div>
            </div>
            <div>
               <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">System Architecture</h3>
               <p className="text-white/40 text-xs font-bold leading-relaxed max-w-sm uppercase tracking-wider">
                  Specialized in high-performance API structures and 
                  complex logic automation. Engineered for scale.
               </p>
            </div>
          </div>

          {/* Location Card */}
          <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-between bg-white/[0.02]">
             <div className="p-4 bg-white/5 border border-white/10 w-fit">
                <Globe className="w-6 h-6 text-white" />
             </div>
             <div>
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">Registry</p>
                <h3 className="text-xl font-black uppercase">Pontianak, ID</h3>
             </div>
          </div>

          {/* Skill Card 1 */}
          <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-between bg-white/[0.03]">
             <div className="flex gap-1">
                <div className="w-3 h-3 bg-white/40"></div>
                <div className="w-3 h-3 bg-white/10"></div>
                <div className="w-3 h-3 bg-white/10"></div>
             </div>
             <div>
                <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Automation</h3>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Logic & Bot Specialist</p>
             </div>
          </div>

          {/* Skill Card 2 */}
          <div className="md:col-span-4 md:row-span-1 bento-card group flex items-center justify-between bg-white/5">
             <div className="flex flex-col h-full justify-between">
                <div className="p-4 bg-white/5 border border-white/10 w-fit">
                   <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Core Infrastructure</h3>
                   <p className="text-white/40 text-xs font-bold uppercase tracking-widest">PostgreSQL / Redis / Systems</p>
                </div>
             </div>
             <div className="hidden lg:block w-48 h-full bg-white/[0.02] border-l border-white/10">
                <div className="h-full flex flex-col justify-center gap-1 p-6">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="h-px bg-white/10 w-full"></div>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
