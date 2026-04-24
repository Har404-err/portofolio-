import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Cpu, Globe, ArrowUpRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Main Intro Card */}
          <div className="md:col-span-4 md:row-span-1 bento-card flex flex-col justify-between group">
            <div className="flex justify-between items-start">
               <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <Terminal className="w-6 h-6 text-white" />
               </div>
               <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
            </div>
            <div>
               <h3 className="text-2xl font-bold mb-4">Engineering Efficiency</h3>
               <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                  I specialize in building high-performance API architectures and 
                  intelligent automation systems that scale.
               </p>
            </div>
          </div>

          {/* Location Card */}
          <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-between">
             <div className="p-3 bg-white/5 rounded-2xl border border-white/10 w-fit">
                <Globe className="w-6 h-6 text-white" />
             </div>
             <div>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Based in</p>
                <h3 className="text-xl font-bold">Pontianak, ID</h3>
             </div>
          </div>

          {/* Skill Card 1 */}
          <div className="md:col-span-2 md:row-span-1 bento-card bg-gradient-to-br from-[#0a0a0a] to-[#111] flex flex-col justify-between border-white/5">
             <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
             </div>
             <div>
                <h3 className="text-lg font-bold mb-2">Automation</h3>
                <p className="text-white/40 text-xs">Self-learning bots & intelligent scripts.</p>
             </div>
          </div>

          {/* Skill Card 2 */}
          <div className="md:col-span-4 md:row-span-1 bento-card group flex items-center justify-between">
             <div className="flex flex-col h-full justify-between">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 w-fit">
                   <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">Scalable Backends</h3>
                   <p className="text-white/40 text-sm">PostgreSQL, Redis, and Microservices.</p>
                </div>
             </div>
             <div className="hidden lg:block relative w-48 h-full bg-white/[0.02] border-l border-white/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                   <Cpu className="w-16 h-16 text-white/5 animate-pulse" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
