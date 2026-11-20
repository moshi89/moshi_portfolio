import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Download } from 'lucide-react';
import Hero from './components/Hero';
import Skills from './components/Skills';
import CbtSimulator from './components/CbtSimulator';
import RtosSimulator from './components/RtosSimulator';
import PetRobotSimulator from './components/PetRobotSimulator';
import Competitions from './components/Competitions';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);

  // Monitor scroll to highlight active sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'skills-competency', 'cbt-companion', 'rtos-safety', 'pet-robot-sec', 'competitions'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Dynamic Background Patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="text-base font-display font-bold tracking-tight text-slate-100 hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Moshi
          </button>

          {/* Zone 2: 5 Concise Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <button
              type="button"
              onClick={() => scrollToSection('skills-competency')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'skills-competency'
                  ? 'border-indigo-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Skills
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('cbt-companion')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'cbt-companion'
                  ? 'border-indigo-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              CBT App
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('rtos-safety')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'rtos-safety'
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              RTOS Controller
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pet-robot-sec')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'pet-robot-sec'
                  ? 'border-pink-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pet Robot
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('competitions')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'competitions'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              2026 Experience
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="hidden md:flex items-center shrink-0">
            <a
              href="./Moshi_Resume.pdf"
              download="Moshi_Resume.pdf"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume PDF</span>
            </a>
          </div>

          {/* Mobile Menu Toggler */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-16 bg-slate-950 border-b border-slate-900 z-40 p-4 md:hidden space-y-2 font-mono text-xs shadow-2xl"
          >
            <button
              type="button"
              onClick={() => scrollToSection('skills-competency')}
              className="w-full text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 block"
            >
              Skills
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('cbt-companion')}
              className="w-full text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 block"
            >
              CBT Companion App
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('rtos-safety')}
              className="w-full text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 block"
            >
              RTOS Safety Controller
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pet-robot-sec')}
              className="w-full text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 block"
            >
              Pet Companion Robot (2024)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('competitions')}
              className="w-full text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-200 block"
            >
              DACON &amp; DIVE 2026 Experience
            </button>
            <a
              href="./Moshi_Resume.pdf"
              download="Moshi_Resume.pdf"
              className="w-full text-center p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium block"
            >
              Download Resume PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
        {/* Hero Profile */}
        <section id="hero" className="scroll-mt-24">
          <Hero onOpenResume={() => setResumeOpen(true)} />
        </section>

        {/* Engineering Mission */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
          <div className="space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Senior Undergraduate Engineering Vision
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white leading-tight text-balance">
              Bridging Physical AI, Robotic Manipulation &amp; Low-Level Industrial Determinism
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
              As a 4th-year Computer Science &amp; Engineering student at <strong>Pusan National University</strong>, I am deeply interested in <strong>Physical AI and Robotic AI</strong> — especially intelligent <strong>robot arm control</strong>, embodied perception, and real-time actuation. From MVVM Jetpack Compose interfaces running quantized on-device NLP models to deterministic RTOS task schedulers controlling physical hardware under strict timing bounds, I focus on full-spectrum dependable systems.
            </p>
          </div>
        </div>

        {/* Technical Competencies */}
        <section id="skills-competency" className="scroll-mt-24">
          <Skills />
        </section>

        {/* Section Divider */}
        <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 py-2">
          <div className="h-px bg-slate-900 flex-1" />
          <span className="uppercase tracking-widest">
            대표 프로젝트 · Featured Engineering Systems
          </span>
          <div className="h-px bg-slate-900 flex-1" />
        </div>

        {/* Project 01: CBT Companion App & Live Simulator */}
        <section id="cbt-companion" className="scroll-mt-24">
          <CbtSimulator />
        </section>

        {/* Project 02: RTOS Controller & Live Simulator */}
        <section id="rtos-safety" className="scroll-mt-24">
          <RtosSimulator />
        </section>

        {/* Project 03: Smart Pet Companion Robot (2024) */}
        <section id="pet-robot-sec" className="scroll-mt-24">
          <PetRobotSimulator />
        </section>

        {/* Completed Competition Experience (DACON & DIVE 2026) */}
        <section id="competitions" className="scroll-mt-24">
          <Competitions />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Resume Preview & Download Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
