import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Button } from "@heroui/react";
import { ArrowUpRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 800], [0, 150]);
  const yText = useTransform(scrollY, [0, 800], [0, -120]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.05]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-20 overflow-hidden bg-background">
      {/* Background Profile Layer */}
      <motion.div 
        style={{ y: yImage, scale, opacity }}
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center p-6 md:p-20"
      >
        <div className="relative w-full max-w-6xl h-full filter contrast-[1.1] brightness-[0.7]">
          <img 
            src="https://i.imgur.com/zJcjQlC.jpeg" 
            alt="MUH4RHQ" 
            className="w-full h-full object-cover rounded-[50px] md:rounded-[100px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
          <div className="absolute inset-0 bg-background/30"></div>
        </div>
      </motion.div>

      {/* Main Content Layer */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center py-20"
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center gap-4">
          <span className="w-8 md:w-16 h-px bg-primary/50"></span>
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[1em] text-primary">
            EST. MMXXV
          </span>
          <span className="w-8 md:w-16 h-px bg-primary/50"></span>
        </motion.div>

        <motion.div style={{ y: yText }} className="relative w-full">
          <motion.h1 
            variants={itemVariants}
            className="font-jakarta text-[14vw] md:text-[15vw] font-black leading-[0.8] tracking-[-0.08em] uppercase select-none text-white mix-blend-difference"
          >
            MUH4RHQ
          </motion.h1>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-12 md:mt-20 max-w-3xl px-4"
        >
          <p className="text-xl md:text-3xl lg:text-4xl text-white/90 font-light tracking-tight leading-snug">
            <span className="text-primary font-black italic">High-Performance API Engineer</span> & <span className="text-white font-black italic underline decoration-primary underline-offset-[12px]">Automation Specialist</span>.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-16 md:mt-24"
        >
          <Button 
            as="a"
            href="#contact"
            color="primary"
            variant="shadow"
            size="lg"
            endContent={<ArrowUpRight className="w-5 h-5" />}
            className="font-jakarta font-black uppercase text-[10px] md:text-xs tracking-[0.3em] h-16 px-12 rounded-full"
          >
            Connect With Me
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
