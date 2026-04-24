import React from 'react';
import { motion } from 'framer-motion';
import { Button, Separator, Link } from "@heroui/react";
import { Send, Code2, MessageCircle, Users, Bell } from 'lucide-react';

const Contact: React.FC = () => {
  const links = [
    { label: 'Open Source', title: 'GITHUB', url: 'https://github.com/Har404-err', icon: <Code2 /> },
    { label: 'Chat Now', title: 'WHATSAPP', url: 'https://wa.me/6282148570591', icon: <MessageCircle /> },
    { label: 'Community', title: 'COMMUNITY GROUP', url: 'https://chat.whatsapp.com/Gt6N9fKDS8L2VBzlOG64Z0?mode=gi_t', icon: <Users /> }, 
    { label: 'Bot Updates', title: 'BOT GROUP', url: 'https://chat.whatsapp.com/KkQDOXDZeDuC6UskCmpGg3?mode=gi_t', icon: <Bell /> }     
  ];

  return (
    <section id="contact" className="py-24 md:py-48 px-6 lg:px-20 bg-background overflow-hidden relative">
      <div className="container mx-auto max-w-7xl text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 md:mb-32 gap-12 lg:gap-20">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="flex items-center gap-4 mb-8">
              <Send className="text-primary w-6 h-6" />
              <span className="text-[10px] uppercase font-black tracking-[0.6em] text-primary">Availability</span>
            </div>
            
            <h2 className="font-jakarta text-[12vw] lg:text-[7vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-white">
              LET'S <br/> <span className="text-primary">CREATE.</span>
            </h2>
            <p className="mt-8 md:mt-12 text-lg lg:text-2xl text-white/60 font-light leading-tight">
              Punya ide menarik? Saya selalu siap untuk tantangan baru. Hubungi saya melalui salah satu platform di bawah ini.
            </p>
          </motion.div>
          
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="hidden lg:flex w-full lg:w-1/2 justify-center items-center pt-12"
          >
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-white/10 flex items-center justify-center p-5 relative">
               <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping"></div>
               <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_50px_rgba(0, 240, 255,0.2)]">
                  <span className="text-6xl text-primary font-black italic">!</span>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col mt-20">
          {links.map((link, idx) => (
            <motion.div key={idx}>
              <Separator className="bg-white/5" />
              <Link 
                href={link.url}
                isExternal
                className="group relative py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between transition-all duration-500 overflow-hidden w-full text-white"
              >
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700 ease-out"></div>
                
                <div className="relative z-10 flex flex-col">
                  <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[1em] text-white/30 group-hover:text-primary transition-colors mb-2">{link.label}</span>
                  <span className="font-jakarta text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white/10 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-1">
                    {link.title}
                  </span>
                </div>
                
                <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-8">
                   <Button
                      isIconOnly
                      variant="bordered"
                      className="w-12 h-12 md:w-20 md:h-20 rounded-full border-white/10 group-hover:border-primary group-hover:bg-primary group-hover:text-black text-white text-xl md:text-3xl transition-all duration-500 transform group-hover:rotate-45"
                   >
                      {link.icon}
                   </Button>
                </div>
              </Link>
            </motion.div>
          ))}
          <Separator className="bg-white/5" />
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-12 md:p-16 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
              <span className="text-[11px] uppercase font-black tracking-[0.6em] text-primary mb-8 block">Presence</span>
              <p className="font-jakarta text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">PONTIANAK, ID <br/> <span className="text-white/20">UTC+7</span></p>
           </div>
           <div className="p-12 md:p-16 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors">
              <span className="text-[11px] uppercase font-black tracking-[0.6em] text-primary mb-8 block">Experience</span>
              <p className="font-jakarta text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">BUILDING SINCE <br/> <span className="text-white/20">2025</span></p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
