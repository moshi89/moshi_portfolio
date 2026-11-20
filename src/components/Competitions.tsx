import { Trophy, MapPin, Target, Users, CheckCircle2, Layers } from 'lucide-react';

export default function Competitions() {
  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            2026 Competition &amp; Hackathon Experience
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-400" />
            <span>DACON &amp; DIVE 2026 Participation</span>
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400">
          Completed in July 2026 · Non-winning team participation records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: DACON 2026 Completed Experience */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Completed · July 2026</span>
                  <span aria-hidden="true">·</span>
                  <span>Participation Experience (No Award)</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight pt-1">
                  [DACON] 2026 AI·SW중심대학 디지털 경진대회
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Pusan National University Team · SW &amp; AI Track
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Participated alongside fellow <strong>Pusan National University (PNU)</strong> students in the national digital competition for SW-centered universities. Although our team did not win a prize, completing the full competition cycle gave us firsthand experience tackling real-world evaluation benchmarks and strict submission constraints.
            </p>

            {/* Key Takeaways & Experience */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-semibold">
                What I Practiced &amp; Learned
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 font-medium block">Fault-Tolerant Prototyping</span>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Designed reproducible data and inference pipelines under tight validation deadlines.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 font-medium block">Team Experiment Iteration</span>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Collaborated on model benchmarking, error analysis, and structured technical documentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Outcome: Completed (Participation Experience)</span>
            <span>Busan / National · July 2026</span>
          </div>
        </div>

        {/* Right: DIVE 2026 Completed Experience & Academic Focus */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed · July 2026
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Busan, KR
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">
                  DIVE 2026 Busan Global Hackathon
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Participation Experience (No Award) · Sprint Team Member
                </p>
              </div>

              <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-sans">
                Completed the DIVE 2026 hackathon sprint in Busan. While our team did not place for an award, shipping a functional end-to-end prototype within a compressed weekend taught practical lessons in scope prioritization, API integration, and live demo delivery under pressure.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs">
                <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-medium block">Key Sprint Takeaways</span>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Rapid MVP scoping, clean frontend-backend handoffs, and resilient demo fallbacks.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Status: Finished</span>
              <span>Experience Logged</span>
            </div>
          </div>

          {/* Academic Year Focus Callout */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block font-semibold">
              Academic Focus · Senior Year (Year 4)
            </span>
            <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed font-sans">
              Currently in my <strong>4th year</strong> of Computer Science &amp; Engineering at Pusan National University, expanding my focus into <strong>Physical AI</strong> and <strong>Robotic AI (robot arm manipulation &amp; control)</strong> alongside <strong>On-Device AI</strong> and <strong>Deterministic RTOS Systems</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
