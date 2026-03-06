/* ─── Features Section ─── */
/* Asymmetric grid matching the TaskIQ design:
   - Smart Gantt Charts (large, left)
   - Detailed Project Documentation (right)
   - Connected Customer Support (bottom-left)
   - Project Planning with Gantt Charts (bottom-right, large) */

export function Features() {
  return (
    <section id="features" className="section-padding bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Bento grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 — Smart Gantt Charts */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm card-hover group">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Gantt Charts for Effortless Project Planning
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Real value comes with challenges—not because the work is redundant,
              but because meaningful results demand effort. Every difficulty becomes
              a stepping stone toward success.
            </p>

            {/* Mini chart illustration */}
            <div className="bg-teal-50 rounded-xl p-5">
              <div className="flex items-end gap-1.5 h-20 mb-4">
                {[40, 65, 50, 80, 55, 70, 45, 85, 60, 75, 90, 52].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all duration-300 group-hover:scale-y-110"
                      style={{
                        height: `${h}%`,
                        background:
                          i < 4 ? "#0d6e6e" : i < 8 ? "#10b981" : "#94d3a2",
                        transformOrigin: "bottom",
                      }}
                    />
                  )
                )}
              </div>
              <div className="flex gap-4 text-[10px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal" /> Performance
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-accent" /> Activities
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-300" /> Capabilities
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 — Detailed Project Documentation */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm card-hover">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Detailed Project Documentation
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Smart results come with obstacles—not out of
              flexibility or difficulty, but because real progress
              demands consistent effort and dedication.
            </p>

            {/* Conversion rate illustration */}
            <div className="bg-teal-50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium text-gray-400 uppercase">
                  Conversion rate
                </p>
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span className="text-lg font-bold text-gray-900">
                    12.32%
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 280 60" className="w-full h-14" fill="none">
                <path
                  d="M0 50 Q40 35, 70 40 T140 25 T210 30 T280 10"
                  stroke="#0d6e6e"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0 50 Q40 35, 70 40 T140 25 T210 30 T280 10 V60 H0 Z"
                  fill="#0d6e6e"
                  fillOpacity="0.08"
                />
              </svg>
            </div>
          </div>

          {/* Card 3 — Connected Customer Support */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm card-hover">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Connected Customer Support
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              True value often comes with challenges—not
              because it is formidable, but because meaningful
              results require effort and dedication.
            </p>

            {/* Support illustration */}
            <div className="bg-teal-50 rounded-xl p-5">
              <div className="flex gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: ["#0d6e6e", "#10b981", "#6ee7b7"][i] }}
                    >
                      {["A", "B", "C"][i]}
                    </div>
                  ))}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 rounded-full bg-teal/20 w-full" />
                  <div className="h-2 rounded-full bg-teal/10 w-3/4" />
                  <div className="h-2 rounded-full bg-teal/5 w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 — Project Planning with Gantt Charts */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm card-hover">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Project Planning with Gantt Charts
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Great outcomes are rarely effortless. Challenges arise not from flaws,
              but from the pursuit of meaningful results. Each obstacle guides the
              way toward excellence.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 mb-6"
            >
              Try Demo
            </a>

            {/* Gantt chart illustration */}
            <div className="bg-teal-50 rounded-xl p-4">
              <div className="space-y-2">
                {[
                  { w: "70%", color: "#0d6e6e" },
                  { w: "55%", color: "#10b981" },
                  { w: "85%", color: "#0d6e6e" },
                  { w: "40%", color: "#6ee7b7" },
                  { w: "65%", color: "#10b981" },
                ].map((bar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-16 text-[10px] text-gray-400 font-medium">
                      Task {i + 1}
                    </div>
                    <div className="flex-1 h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: bar.w, background: bar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
