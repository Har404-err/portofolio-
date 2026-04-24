import React from 'react';
import { motion } from 'framer-motion';

const Stack: React.FC = () => {
  const stack = [
    { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
    { name: 'Redis', icon: 'devicon-redis-plain colored' },
    { name: 'Docker', icon: 'devicon-docker-plain colored' },
    { name: 'Express', icon: 'devicon-express-original' },
    { name: 'Vite', icon: 'devicon-vitejs-plain colored' },
    { name: 'Git', icon: 'devicon-git-plain colored' },
  ];

  return (
    <section id="stack" className="py-24 px-6 bg-black">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Technology Stack</h2>
          <p className="text-white/30 max-w-md text-xs font-bold uppercase tracking-widest">Selected instruments for high-performance production environments.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {stack.map((item, i) => (
            <div 
              key={item.name}
              className="bg-black p-12 flex flex-col items-center justify-center group hover:bg-white transition-all duration-300"
            >
              <i className={`${item.icon} text-5xl mb-6 grayscale group-hover:grayscale-0 group-hover:text-black transition-all duration-300`}></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-black transition-colors">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
