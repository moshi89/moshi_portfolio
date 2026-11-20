import { ExternalLink, FileVideo, Github, Play, Code2 } from 'lucide-react';

export interface ProjectBreakdownProps {
  accentColor: 'indigo' | 'amber' | 'pink';
  overview: string;
  problem: string;
  role: string;
  technologies: string[];
  results: string;
  videoDemoUrl?: string;
  videoDemoLabel?: string;
  sourceCodeUrl: string;
  onRunInteractiveDemo: () => void;
  interactiveDemoLabel?: string;
  onViewInPageCode?: () => void;
  inPageCodeLabel?: string;
}

const ACCENT_MAP = {
  indigo: {
    label: 'text-indigo-400',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    btnGhost: 'border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10',
  },
  amber: {
    label: 'text-amber-400',
    btnPrimary: 'bg-amber-600 hover:bg-amber-500 text-white',
    btnGhost: 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10',
  },
  pink: {
    label: 'text-pink-400',
    btnPrimary: 'bg-pink-600 hover:bg-pink-500 text-white',
    btnGhost: 'border-pink-500/30 text-pink-300 hover:bg-pink-500/10',
  },
};

export default function ProjectBreakdown({
  accentColor,
  overview,
  problem,
  role,
  technologies,
  results,
  videoDemoUrl,
  videoDemoLabel = 'Video Demo',
  sourceCodeUrl,
  onRunInteractiveDemo,
  interactiveDemoLabel = 'Live Interactive Demo',
  onViewInPageCode,
  inPageCodeLabel = 'View Spec / Code',
}: ProjectBreakdownProps) {
  const styles = ACCENT_MAP[accentColor];

  return (
    <div className="mb-8 rounded-xl border border-slate-800/80 bg-slate-900/35 p-5 md:p-6 space-y-5">
      {/* Top Row: Overview (대표 프로젝트 소개) */}
      <div className="space-y-1.5">
        <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${styles.label}`}>
          대표 프로젝트 소개 · Project Overview
        </span>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {overview}
        </p>
      </div>

      {/* Middle 2x2 Grid: Problem, Role, Tech, Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-800/70">
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-semibold text-slate-400">
            문제 정의 · Problem Definition
          </h3>
          <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-sans">
            {problem}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-mono font-semibold text-slate-400">
            역할 · My Role
          </h3>
          <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-sans">
            {role}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-mono font-semibold text-slate-400">
            기술 · Tech Stack
          </h3>
          <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-mono">
            {technologies.join(' · ')}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-mono font-semibold text-slate-400">
            결과 · Results &amp; Outcomes
          </h3>
          <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-sans">
            {results}
          </p>
        </div>
      </div>

      {/* Bottom Action Bar: Demo Links & Source Code Links */}
      <div className="pt-4 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-mono text-slate-500 mr-1">데모 &amp; 소스 코드 · Links:</span>
          <button
            type="button"
            onClick={onRunInteractiveDemo}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${styles.btnPrimary}`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{interactiveDemoLabel}</span>
          </button>

          {videoDemoUrl && (
            <a
              href={videoDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${styles.btnGhost}`}
            >
              <FileVideo className="w-3.5 h-3.5" />
              <span>{videoDemoLabel}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onViewInPageCode && (
            <button
              type="button"
              onClick={onViewInPageCode}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{inPageCodeLabel}</span>
            </button>
          )}

          <a
            href={sourceCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Github className="w-3.5 h-3.5 text-slate-300" />
            <span>Source Code (GitHub)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
