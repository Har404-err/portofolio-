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
          <h2 className="text-3xl font-bold mb-4">Tech Inventory</h2>
          <p className="text-white/40 max-w-md">Selected technologies I use to build production-grade systems.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-3xl">
          {stack.map((item, i) => (
            <div 
              key={item.name}
              className="bg-black p-10 flex flex-col items-center justify-center group hover:bg-white/[0.02] transition-colors duration-500"
            >
              <i className={`${item.icon} text-4xl mb-4 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500`}></i>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
