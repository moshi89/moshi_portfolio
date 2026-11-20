import { useEffect, useState } from 'react';
import { X, Download, Github, Mail, MapPin, School, ExternalLink, User } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div>
            <h2 id="resume-modal-title" className="font-display text-lg font-bold text-white">
              이력서 · Moshi Curriculum Vitae
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Moshi_Resume.pdf · Pusan National University CSE (4th Year)
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="./Moshi_Resume.pdf"
              download="Moshi_Resume.pdf"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume preview"
              className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Resume Sheet Content */}
        <div className="p-6 md:p-8 space-y-6 text-sm font-sans">
          {/* Header Block */}
          <div className="pb-5 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0 flex items-center justify-center">
                {!imgError ? (
                  <img
                    src="./assets/aistudio/image_9830affa.png"
                    alt="Moshi profile picture"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <User className="w-6 h-6 text-indigo-400" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-2xl font-bold text-white">Moshi (@moshi89)</h3>
                <p className="text-slate-300">
                  Physical AI, Robotics &amp; Embedded Systems · Senior Undergraduate
                </p>
              </div>
            </div>
            <div className="space-y-1 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pusan National University · CSE Year 4</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Busan, South Korea</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a href="mailto:moshim668@gmail.com" className="hover:text-indigo-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> moshim668@gmail.com
                </a>
                <a
                  href="https://github.com/moshi89"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" /> github.com/moshi89
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Current Interests · 현재 관심 분야
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Physical AI &amp; Robotic AI (Robot Arm Manipulation, Kinematics &amp; Embodied Control), Embedded AI Engineering (On-Device Deep Learning &amp; Quantization), Deterministic Real-Time Operating Systems (uC/OS-III, FreeRTOS), and Kotlin Jetpack Compose Architecture.
            </p>
          </div>

          {/* Featured Projects */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Representative Projects · 대표 프로젝트
            </h4>
            <div className="space-y-3 text-xs md:text-[13px]">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-white">1. Clinical CBT Companion App</span>
                  <span className="font-mono text-slate-500">Kotlin · ONNX · Gemini API</span>
                </div>
                <p className="text-slate-400">
                  Hybrid on-device NLP (XLM-RoBERTa) &amp; cloud Socratic therapy app with offline rule-based fallback, Dispatchers.IO isolation (0ms UI lag), and GPS weather-aware behavioral activation.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-white">2. RTOS-Factory-Safety-Controller (STM32)</span>
                  <span className="font-mono text-slate-500">C/C++ · uC/OS-III · STM32</span>
                </div>
                <p className="text-slate-400">
                  9-task preemptive real-time industrial dual-conveyor safety controller with ISR emergency interlocks, ADXL345 vibration hysteresis, HC-SR04 proximity stop, and SG90 fail-secure locking.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-semibold text-white">3. Smart Pet Companion Robot (2024)</span>
                  <span className="font-mono text-slate-500">Arduino Uno · C++ · Hardware</span>
                </div>
                <p className="text-slate-400">
                  Autonomous pet feeder and tracking rover integrating HC-SR04 sonar avoidance, SG90 dispenser servo, photoresistor night-light automation, DFPlayer Mini audio, and custom 16x2 LCD glyphs.
                </p>
              </div>
            </div>
          </div>

          {/* Competition Experience */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Competition Experience · 대회 및 해커톤 참가 경험 (2026)
            </h4>
            <ul className="space-y-2 text-xs md:text-[13px] text-slate-300">
              <li>
                <strong className="text-white">DACON 2026 AI·SW중심대학 디지털 경진대회 (Completed · Participated):</strong>{' '}
                Represented PNU in the national software/AI competition (July 2026). Did not place for an award; gained real-world experience in fault-tolerant ML pipelines and national benchmarking.
              </li>
              <li>
                <strong className="text-white">DIVE 2026 Busan Global Hackathon (Completed · Participated):</strong>{' '}
                Completed an intensive hackathon sprint in Busan (July 2026). Did not win; strengthened compressed full-stack prototyping, team collaboration, and rapid technical pitching.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
