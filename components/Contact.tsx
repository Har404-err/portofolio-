import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LottieAnimation from './LottieAnimation';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const waNumber = '6282148570591';
    // Format the message for WhatsApp
    const text = `Halo MUH4RHQ!%0A%0ASaya *${name}* (${email}).%0A%0A${message}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  const links = [
    { label: 'Open Source', title: 'GITHUB', url: 'https://github.com/Har404-err', accent: '#00f0ff' },
    { label: 'Chat Now', title: 'WHATSAPP', url: 'https://wa.me/6282148570591', accent: '#ffffff' },
    { label: 'Community', title: 'COMMUNITY GROUP', url: 'https://chat.whatsapp.com/Gt6N9fKDS8L2VBzlOG64Z0?mode=gi_t', accent: '#00f0ff' }, 
    { label: 'Bot Updates', title: 'BOT GROUP', url: 'https://chat.whatsapp.com/KkQDOXDZeDuC6UskCmpGg3?mode=gi_t', accent: '#ffffff' }     
  ];

  return (
    <section id="contact" className="py-24 md:py-48 px-6 lg:px-20 bg-[#030712] overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 md:mb-32 gap-12 lg:gap-20">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h2 className="font-jakarta text-[12vw] lg:text-[7vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-white">
              LET'S <br/> <span className="text-[#00f0ff]">CREATE</span>
            </h2>
            <p className="mt-8 md:mt-12 text-lg lg:text-2xl text-white/60 font-light leading-tight">
              Punya ide menarik? Saya selalu siap untuk tantangan baru. Hubungi saya untuk konsultasi gratis.
            </p>
            
            {/* Functional Contact Form */}
            <div className="mt-12 relative z-20">
               <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                 <input 
                   type="text" 
                   name="name" 
                   value={formData.name} 
                   onChange={handleChange} 
                   placeholder="Your Name" 
                   required
                   className="interactive bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                 />
                 <input 
                   type="email" 
                   name="email" 
                   value={formData.email} 
                   onChange={handleChange} 
                   placeholder="Your Email" 
                   required
                   className="interactive bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                 />
                 <textarea 
                   name="message" 
                   value={formData.message} 
                   onChange={handleChange} 
                   placeholder="Your Message" 
                   rows={4}
                   required
                   className="interactive bg-white/5 border border-white/10 text-white px-6 py-4 rounded-xl focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all resize-none"
                 />
                 <button 
                   type="submit" 
                   className="interactive group relative px-10 py-5 overflow-hidden rounded-xl transition-all w-fit hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                 >
                   <div className="absolute inset-0 bg-[#00f0ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                   <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-[#00f0ff] transition-colors"></div>
                   <span className="relative z-10 text-white group-hover:text-black font-jakarta font-black uppercase text-[10px] md:text-xs tracking-[0.3em] flex items-center gap-4 transition-colors">
                     Send Message <span className="text-xl transform group-hover:translate-x-2 transition-transform">→</span>
                   </span>
                 </button>
               </form>
            </div>
          </motion.div>
          
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="hidden lg:flex w-full lg:w-1/2 justify-center items-center pt-12"
          >
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-white/10 flex items-center justify-center p-5 relative">
               <div className="absolute inset-0 rounded-full border border-[#00f0ff]/20 animate-ping"></div>
               <div className="w-full h-full rounded-full bg-[#00f0ff]/10 flex items-center justify-center shadow-[0_0_50px_rgba(0, 240, 255,0.2)] overflow-hidden">
                  <LottieAnimation 
                    url="https://lottie.host/17e2eefd-4a11-4770-b742-d61ec9b3986a/U4H0gJzTfT.json" 
                    className="w-full h-full object-cover scale-[1.5]"
                  />
               </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col mt-20">
          {links.map((link, idx) => (
            <motion.a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive group relative py-8 md:py-12 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between transition-all duration-500 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00f0ff] group-hover:w-full transition-all duration-700 ease-out"></div>
              
              <div className="relative z-10 flex flex-col">
                <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[1em] text-white/30 group-hover:text-[#00f0ff] transition-colors mb-2">{link.label}</span>
                <span className="font-jakarta text-3xl md:text-5xl lg:text-[6rem] font-black uppercase tracking-tighter text-white/10 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-1">
                  {link.title}
                </span>
              </div>
              
              <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-8">
                 <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00f0ff] group-hover:bg-[#00f0ff] transition-all duration-500">
                    <span className="text-white group-hover:text-black text-xl md:text-3xl transition-colors transform group-hover:rotate-45 transition-transform duration-500">↗</span>
                 </div>
              </div>
            </motion.a>
          ))}
          <div className="border-t border-white/5"></div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
           <div className="p-12 md:p-16 bg-[#030712] hover:bg-white/[0.02] transition-colors">
              <span className="text-[11px] uppercase font-black tracking-[0.6em] text-[#00f0ff] mb-8 block">Presence</span>
              <p className="font-jakarta text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">PONTIANAK, ID <br/> <span className="text-white/20">UTC+7</span></p>
           </div>
           <div className="p-12 md:p-16 bg-[#030712] hover:bg-white/[0.02] transition-colors">
              <span className="text-[11px] uppercase font-black tracking-[0.6em] text-[#00f0ff] mb-8 block">Experience</span>
              <p className="font-jakarta text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">BUILDING SINCE <br/> <span className="text-white/20">2025</span></p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
