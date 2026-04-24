import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Chip, Separator } from "@heroui/react";
import { User, Code2, Zap, Rocket } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: <Code2 className="text-primary" />, label: 'Experience', value: '1+ Years' },
    { icon: <Zap className="text-primary" />, label: 'Success Rate', value: '99%' },
    { icon: <Rocket className="text-primary" />, label: 'Projects', value: '20+' },
  ];

  const skills = [
    'API Architecture', 'Node.js', 'Typescript', 'Automation', 
    'Bot Development', 'Backend Systems', 'Microservices', 'Database Design'
  ];

  return (
    <section id="about" className="py-24 md:py-48 px-6 lg:px-20 bg-background relative overflow-hidden text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <User className="text-primary w-6 h-6" />
              <span className="text-[10px] uppercase font-black tracking-[0.6em] text-primary">Identity</span>
            </div>
            
            <h2 className="font-jakarta text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-10">
              BUILDING <br /> <span className="text-white/20">EFFICIENCY.</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-12">
              Saya adalah pengembang backend yang berfokus pada performa dan skalabilitas. 
              Spesialisasi saya adalah membangun infrastruktur API yang kuat dan bot 
              otomatisasi yang cerdas untuk mempercepat alur kerja bisnis.
            </p>

            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <Chip 
                  key={skill}
                  variant="bordered"
                  color="primary"
                  className="border-white/10 text-white font-bold uppercase text-[10px] tracking-widest px-4 py-6"
                >
                  {skill}
                </Chip>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 30 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            {stats.map((stat, i) => (
              <Card 
                key={i}
                className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-8 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/30">{stat.label}</p>
                      <p className="text-2xl font-jakarta font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-primary/20 text-4xl font-black italic">0{i + 1}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
