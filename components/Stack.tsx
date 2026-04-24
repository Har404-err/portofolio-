import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardFooter } from "@heroui/react";
import { Layers } from 'lucide-react';

const Stack: React.FC = () => {
  const stack = [
    { name: 'Node.js', icon: 'devicon-nodejs-plain colored', category: 'Runtime' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain colored', category: 'Language' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', category: 'Database' },
    { name: 'Redis', icon: 'devicon-redis-plain colored', category: 'Caching' },
    { name: 'Docker', icon: 'devicon-docker-plain colored', category: 'DevOps' },
    { name: 'Express', icon: 'devicon-express-original', category: 'Framework' },
    { name: 'Vite', icon: 'devicon-vitejs-plain colored', category: 'Bundler' },
    { name: 'Git', icon: 'devicon-git-plain colored', category: 'VCS' },
  ];

  return (
    <section id="stack" className="py-24 md:py-48 px-6 lg:px-20 bg-background relative">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <Layers className="text-primary w-6 h-6" />
              <span className="text-[10px] uppercase font-black tracking-[0.6em] text-primary">Tech Stack</span>
            </div>
            <h2 className="font-jakarta text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.8]">
              MY <br /> <span className="text-white/20">WEAPONS.</span>
            </h2>
          </motion.div>
          <p className="text-white/40 text-lg md:text-xl max-w-sm font-medium mb-2 leading-tight">
            Alat dan teknologi yang saya gunakan untuk mengubah ide menjadi kenyataan yang scalable.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20">
          {stack.map((item, i) => (
            <motion.div
              key={item.name}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                isFooterBlurred
                className="bg-white/5 border-white/10 hover:border-primary/50 transition-all group overflow-hidden"
                shadow="none"
              >
                <div className="h-48 flex items-center justify-center p-12 bg-gradient-to-br from-white/[0.02] to-transparent">
                  <i className={`${item.icon} text-6xl md:text-8xl transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100`}></i>
                </div>
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-3 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <p className="text-[10px] text-white/80 uppercase font-black tracking-widest">{item.name}</p>
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">{item.category}</p>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
