import { useState } from 'react';
import { School, MapPin, Mail, Github, Download, FileText, ArrowRight, User } from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
}

export default function Hero({ onOpenResume }: HeroProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-8 md:p-12 shadow-2xl backdrop-blur-xl mb-12">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        {/* Left Column: Identity, Interests, Metadata, Primary Actions */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-400">
              <span>@moshi89</span>
              <span aria-hidden="true">·</span>
              <span>Pusan National University CSE</span>
              <span aria-hidden="true">·</span>
              <span>Year 4 (Senior)</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight text-balance">
                Moshi
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-sans font-light max-w-2xl leading-relaxed">
                4th-year Computer Science &amp; Engineering student pursuing <strong className="text-indigo-400 font-medium">Physical AI, Robotic AI (Robot Arm Control) &amp; Embedded Systems</strong> — bridging quantized deep learning with deterministic hardware and embodied actuation.
              </p>
            </div>
          </div>

          {/* Academic & Contact Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 font-sans">
            <div className="flex items-center gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/70">
              <School className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">Pusan National University (Year 4)</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/70">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Busan, South Korea</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/70">
              <Mail className="w-4 h-4 text-pink-400 shrink-0" />
              <a href="mailto:moshim668@gmail.com" className="hover:text-white transition-colors truncate">
                moshim668@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/70">
              <Github className="w-4 h-4 text-slate-300 shrink-0" />
              <a
                href="https://github.com/moshi89"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors truncate"
              >
                github.com/moshi89
              </a>
            </div>
          </div>

          {/* Current Interests (현재 관심 분야) */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-semibold">
              현재 관심 분야 · Current Interests
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed">
              Physical AI · Robotic AI (Robot Arm Manipulation &amp; Control) · On-Device Machine Learning · RTOS (uC/OS-III &amp; FreeRTOS) · C / C++ (STM32) · Kotlin &amp; Jetpack Compose
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#cbt-companion"
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="./Moshi_Resume.pdf"
              download="Moshi_Resume.pdf"
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors border border-slate-700 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>이력서 PDF 다운로드 · Resume PDF</span>
            </a>
            <button
              type="button"
              onClick={onOpenResume}
              className="px-4 py-2.5 rounded-lg bg-transparent hover:bg-slate-800/70 text-slate-300 text-xs font-medium transition-colors border border-slate-800 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview CV</span>
            </button>
          </div>
        </div>

        {/* Right Column: Profile Picture & Concise Engineering Summary */}
        <div className="w-full lg:w-88 bg-gradient-to-b from-indigo-950/40 to-slate-950/60 p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-between space-y-5 shrink-0">
          <div className="pb-4 border-b border-slate-800 flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shrink-0 flex items-center justify-center">
              {!avatarError ? (
                <img
                  src="./assets/aistudio/image_9830affa.png"
                  alt="Moshi profile picture"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900 text-slate-400">
                  <User className="w-6 h-6 text-indigo-400" />
                  <span className="text-[10px] font-mono mt-1">Moshi</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-indigo-400 tracking-widest uppercase font-semibold block">
                Portfolio Snapshot
              </span>
              <div className="mt-0.5 font-display text-2xl font-bold text-white truncate">
                Moshi · Year 4
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                CSE · Pusan National Univ.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Featured Systems</span>
              <span className="text-slate-100 font-mono font-semibold tabular-nums">3 Interactive Demos</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">DACON 2026</span>
              <span className="text-slate-300 font-mono">Completed · Experience</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">DIVE 2026 Busan</span>
              <span className="text-slate-300 font-mono">Completed · Experience</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Resume Document</span>
              <a
                href="./Moshi_Resume.pdf"
                download="Moshi_Resume.pdf"
                className="text-indigo-400 hover:text-indigo-300 font-mono underline underline-offset-2"
              >
                Moshi_Resume.pdf
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex gap-2.5">
            <a
              href="https://github.com/moshi89"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors border border-slate-700 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Github className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
