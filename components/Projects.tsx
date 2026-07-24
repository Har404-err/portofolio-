import React, { useState } from 'react';
import { motion } from 'framer-motion';

const codeSnippets = {
  curl: `curl -X GET "https://api.kyio.web.id/api/v2/ai/deepseek-v4?q=Hello&apikey=KYIO-APIKEY"`,
  js: `const res = await fetch("https://api.kyio.web.id/api/v2/ai/deepseek-v4?q=Hello&apikey=KYIO-APIKEY");\nconst data = await res.json();\nconsole.log(data);`,
  python: `import requests\n\nresponse = requests.get(\n    "https://api.kyio.web.id/api/v2/ai/deepseek-v4",\n    params={"q": "Hello", "apikey": "KYIO-APIKEY"}\n)\nprint(response.json())`
};

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="projects" className="py-20 sm:py-28 md:py-40 bg-[#050505] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-24">
          <div>
            <span className="text-accent font-mono text-xs uppercase tracking-[0.3em] block mb-3">Portfolio Highlights</span>
            <h2 className="font-jakarta text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black uppercase tracking-tighter leading-none text-white">
              FLAGSHIP <br /> <span className="text-accent">PROJECT</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-white/60 font-light text-base md:text-lg leading-relaxed">
              Platform REST API performa tinggi buatan sendiri yang melayani integrasi AI, downloader multimedia, scraping, dan automation tools.
            </p>
          </div>
        </div>

        {/* Main Showcase Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#0a0a0d] border border-white/10 rounded-3xl p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group overflow-hidden"
        >
          {/* Subtle Accent Radial Glow */}
          <div aria-hidden className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono uppercase tracking-widest font-bold">
                  FLAGSHIP API
                </span>
              </div>

              <div>
                <h3 className="font-space text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
                  KyioAPI Gateway
                </h3>
                <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                  Ekosistem REST API terpadu yang dirancang untuk kecepatan tinggi, kestabilan multi-engine fallback, dan ketersediaan tinggi untuk developer & bot WhatsApp/Telegram.
                </p>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Next.js', 'Docker', 'Node.js', 'REST API', 'API Gateway', 'Multi-Engine'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-xs font-mono text-white/70">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Real Stats Row */}
              <div className="grid grid-cols-2 gap-6 w-full pt-4 border-t border-white/5">
                <div>
                  <span className="block text-2xl md:text-4xl font-black text-white font-space">250+</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Active Endpoints</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-4xl font-black text-accent font-space">Multi-Engine</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Fallback Redundancy</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="https://api.kyio.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Kunjungi api.kyio.web.id</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>

            {/* Right Interactive Code Box */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-[#050507] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Code Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="ml-2 text-[10px] font-mono text-white/40">API_REQUEST_PREVIEW</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-[10px] font-mono text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded transition-all"
                  >
                    {copied ? '✓ COPIED' : 'COPY CODE'}
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-black/40">
                  {(['curl', 'js', 'python'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang)}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition-all ${
                        activeTab === lang
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-transparent text-white/40 hover:text-white'
                      }`}
                    >
                      {lang === 'curl' ? 'cURL' : lang === 'js' ? 'JavaScript' : 'Python'}
                    </button>
                  ))}
                </div>

                {/* Code Content */}
                <div className="p-4 overflow-x-auto max-h-60 bg-black/80 font-mono text-xs text-white/80 leading-relaxed">
                  <pre><code>{codeSnippets[activeTab]}</code></pre>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
