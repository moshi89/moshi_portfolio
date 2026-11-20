import { Mail, Github, School, MapPin, Download } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 mt-16 pt-8 pb-12 text-slate-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand/School column */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-display font-bold text-sm">
              <School className="w-4 h-4 text-indigo-400" />
              <span>Moshi (@moshi89) Portfolio</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xl">
              4th-year Undergraduate Portfolio of Moshi, Computer Science &amp; Engineering at Pusan National University. Focused on Physical AI, Robotic AI (Robot Arm Control), Embedded AI, and Deterministic RTOS Systems.
            </p>
          </div>

          {/* Direct channels */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Links &amp; Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
              <a
                href="mailto:moshim668@gmail.com"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors text-slate-300"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">moshim668@gmail.com</span>
              </a>
              <a
                href="https://github.com/moshi89"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors text-slate-300"
              >
                <Github className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>github.com/moshi89</span>
              </a>
              <a
                href="./Moshi_Resume.pdf"
                download="Moshi_Resume.pdf"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors text-slate-300"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Moshi_Resume.pdf</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Busan, South Korea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fine print */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-900 text-slate-500 text-[11px]">
          <p>© 2026 Moshi (@moshi89). Built for static GitHub Pages deployment.</p>
          <p className="font-mono">Pusan National University · Computer Science &amp; Engineering</p>
        </div>
      </div>
    </footer>
  );
}
