import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Terminal, 
  Brain, 
  Cpu, 
  BookOpen, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Search, 
  Check, 
  Layers,
  Flame
} from 'lucide-react';

interface Skill {
  name: string;
  category: 'core' | 'rtos';
  level: number; // 0 to 100
  descEn: string;
  descKo: string;
  tags: string[];
}

const SKILLS_DATA: Skill[] = [
  // Core Software Engineering & Deep Learning
  {
    name: "Android & Jetpack Compose",
    category: "core",
    level: 92,
    descEn: "Advanced multi-threaded UI architectures following clean MVVM principles and structured concurrency via Kotlin Coroutines (Dispatchers.IO).",
    descKo: "클린 MVVM 구조와 코루틴(Dispatchers.IO) 비동기 처리를 활용한 고성능 안드로이드 모던 Jetpack Compose UI 아키텍처 설계.",
    tags: ["Kotlin", "MVVM", "Coroutines", "Jetpack Compose"]
  },
  {
    name: "On-Device Deep Learning & NLP",
    category: "core",
    level: 88,
    descEn: "Quantizing and executing lightweight language models (e.g., XLM-RoBERTa) on mobile devices for fast, offline cognitive distortion analysis.",
    descKo: "모바일 장치 최적화를 위해 경량 언어 모델(XLM-RoBERTa)을 양자화하고, 완전 오프라인 인지 왜곡 탐지 및 자연어 처리를 처리하는 기술.",
    tags: ["PyTorch", "XLM-RoBERTa", "On-Device AI", "Transformers"]
  },
  {
    name: "Full-Stack Development (React/TS/Express)",
    category: "core",
    level: 85,
    descEn: "Building robust web clients paired with scalable RESTful API backends, implementing secure authentications and local caching.",
    descKo: "확장 가능한 RESTful API 백엔드와 상호작용하는 견고한 프론트엔드 설계, 보안 인증 모델 및 대용량 데이터 로컬 캐싱 구현.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Node.js"]
  },
  {
    name: "Clinical CBT System Architecture",
    category: "core",
    level: 90,
    descEn: "Designing offline-first state-machine workflows for clinical micro-interventions, behavioral diaries, and structured progress graphs.",
    descKo: "임상 미세 개입, 인지 행동 일지 및 구조화된 진행 그래프를 위한 오프라인 우선 상태 머신 워크플로우 설계.",
    tags: ["State Machines", "React Native", "Local Storage", "D3.js"]
  },

  // Real-Time & Operating Systems
  {
    name: "Deterministic Task Scheduling (RTOS)",
    category: "rtos",
    level: 90,
    descEn: "Configuring FreeRTOS task priorities, rate monotonic scheduling, and handling interrupt service routines (ISR) under strict latency bounds.",
    descKo: "FreeRTOS 기반 작업 우선순위 지정, 주기적 스케줄링(RMS) 설계, 마이크로초 단위 반응속도를 요하는 인터럽트 서비스 루틴(ISR) 제어.",
    tags: ["C/C++", "FreeRTOS", "ISR", "Task Priority"]
  },
  {
    name: "Industrial Actuator & Sensor Control",
    category: "rtos",
    level: 85,
    descEn: "Interfacing physical sensory modules with microcontrollers, ensuring real-time noise filtering and failsafe mechanical overrides.",
    descKo: "마이크로컨트롤러와 액추에이터/센서 하드웨어 물리 연동, 노이즈 필터링 및 페일세이프(Failsafe) 비상 정지 물리 회로 로직 결합.",
    tags: ["GPIO", "SPI/I2C", "Embedded Systems", "Failsafe Design"]
  },
  {
    name: "Dual-Core Critical Region Safety",
    category: "rtos",
    level: 87,
    descEn: "Preventing priority inversion and deadlocks using priority inheritance protocols, recursive mutexes, and binary semaphores.",
    descKo: "우선순위 상속 프로토콜, 재귀 뮤텍스 및 바이너리 세마포어를 사용하여 우선순위 역전 및 교착 상태를 예방하는 기술.",
    tags: ["Concurrency", "Mutex", "Priority Inversion", "Real-Time Systems"]
  }
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'rtos'>('all');
  const [isKorean, setIsKorean] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSkills = SKILLS_DATA.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchLower) ||
      skill.descEn.toLowerCase().includes(searchLower) ||
      skill.descKo.toLowerCase().includes(searchLower) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="skills-competency" className="scroll-mt-20 border border-slate-900 rounded-3xl bg-slate-950/20 p-6 md:p-8 backdrop-blur-md mb-12">
      
      {/* Header and Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Academic & Professional Skillset</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            Technical Competency & Skills
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {isKorean 
              ? '부산대학교 컴퓨터공학과 전공 역량과 지능형 임베디드 및 온디바이스 AI 연구 성과 요약' 
              : 'Synergy of PNU Computer Science background and Intelligent Embedded & On-Device AI research standards'}
          </p>
        </div>

        {/* Translation Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
          <button
            onClick={() => setIsKorean(!isKorean)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/30 text-xs font-mono text-indigo-400 transition-all flex items-center gap-1"
          >
            <span>{isKorean ? 'English' : '한국어'}</span>
          </button>
        </div>
      </div>

      {/* Skills Inventory Section */}
      <div className="space-y-6">
        
        {/* Controls: Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={isKorean ? "기술 키워드 검색 (예: Kotlin, RTOS, React)..." : "Search skill or tool (e.g., Kotlin, FreeRTOS, PyTorch)..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-600" />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900 overflow-x-auto shrink-0 scrollbar-none gap-0.5">
            {[
              { id: 'all', en: 'All', ko: '전체' },
              { id: 'core', en: 'SW & AI Core', ko: 'AI·S/W 핵심' },
              { id: 'rtos', en: 'RTOS Systems', ko: '임베디드' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isKorean ? category.ko : category.en}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Cards Grid (Responsive 2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800/80">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => {
              const getCategoryStyle = (cat: string) => {
                switch(cat) {
                  case 'core': return 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5';
                  default: return 'border-amber-500/20 text-amber-400 bg-amber-500/5';
                }
              };

              const getCategoryName = (cat: string) => {
                switch(cat) {
                  case 'core': return isKorean ? 'AI & 소프트웨어 엔지니어링' : 'AI & Software Eng';
                  default: return isKorean ? '실시간 운영체제 및 시스템' : 'RTOS & Embedded';
                }
              };

              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 border border-slate-900 rounded-xl bg-slate-950/30 hover:border-slate-800 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] font-mono border px-2 py-0.5 rounded-full ${getCategoryStyle(skill.category)}`}>
                          {getCategoryName(skill.category)}
                        </span>
                        <h4 className="text-sm font-semibold text-white mt-1.5 font-display flex items-center gap-1.5">
                          {skill.category === 'core' && <Brain className="w-4 h-4 text-indigo-400" />}
                          {skill.category === 'rtos' && <Cpu className="w-4 h-4 text-amber-400" />}
                          {skill.name}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-300 block">{skill.level}%</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{isKorean ? '능숙도' : 'MASTERY'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {isKorean ? skill.descKo : skill.descEn}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {skill.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/60">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Simple animated bar */}
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          skill.category === 'core' ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-12 border border-dashed border-slate-900 rounded-2xl text-slate-500 text-xs italic">
              {isKorean ? '검색 필터와 일치하는 기술 역량이 없습니다.' : 'No matching skill found in database.'}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
