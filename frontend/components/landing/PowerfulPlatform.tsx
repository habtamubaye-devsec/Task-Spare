/* ─── PowerfulPlatform Section ─── */
/* "Powerful and easy to use SaaS platform" — split layout with
   left text + CTAs and right dashboard screenshot mockup.
   Matches the TaskIQ design visible in the uploaded images. */

import Link from "next/link";

export function PowerfulPlatform() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-5">
              Powerful and easy to use SaaS platform
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Smart, simple and set up with elegant interfaces that enhance user
              experience. Loves delivering robust, reliable and elegant interfaces.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Color charts to help you in refining business events.",
                "Realistic result results.",
                "AI-powered suite processes for approvals.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="mt-0.5 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d6e6e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="btn-teal px-7 py-3 text-sm font-semibold rounded-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Right — dashboard mockup */}
          <div className="relative">
            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-teal/5 p-6">
                {/* Mini dashboard mockup */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="h-2 w-32 bg-gray-100 rounded-full" />
                  </div>

                  {/* Line chart */}
                  <svg viewBox="0 0 300 90" className="w-full h-24" fill="none">
                    <defs>
                      <linearGradient id="plateauGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d6e6e" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#0d6e6e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 70 Q25 65, 50 55 T100 45 T150 50 T200 30 T250 25 T300 20"
                      stroke="#0d6e6e"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 70 Q25 65, 50 55 T100 45 T150 50 T200 30 T250 25 T300 20 V90 H0 Z"
                      fill="url(#plateauGrad)"
                    />
                    <path
                      d="M0 75 Q40 70, 80 65 T160 55 T240 50 T300 48"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Conversion", value: "24.5%", change: "+4.3%" },
                    { label: "Revenue", value: "$48.2K", change: "+12.1%" },
                    { label: "Users", value: "1,842", change: "+8.7%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-medium uppercase">
                        {stat.label}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-500">
                        {stat.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
