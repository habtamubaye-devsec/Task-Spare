/* ─── Advanced Features Section ─── */
/* 6-block grid: Fast Results, Advanced Analytics, Communication Tools,
   Customizable, Integration Capabilities, Access Control */

import {
  Zap,
  BarChart3,
  MessageSquare,
  Palette,
  Puzzle,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Really fast.",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard.",
    color: "#0d6e6e",
    bg: "#e6f5f5",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard.",
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    icon: MessageSquare,
    title: "Communication Tools",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard.",
    color: "#0d6e6e",
    bg: "#e6f5f5",
  },
  {
    icon: Palette,
    title: "Customizable",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard.",
    color: "#ef4444",
    bg: "#fee2e2",
  },
  {
    icon: Puzzle,
    title: "Integration Capabilities",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard.",
    color: "#0d6e6e",
    bg: "#e6f5f5",
  },
  {
    icon: ShieldCheck,
    title: "Access Control",
    description:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard.",
    color: "#3b82f6",
    bg: "#dbeafe",
  },
];

export function AdvancedFeatures() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-teal bg-teal-light rounded-full mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Powerful and easy to use SaaS platform
          </h2>
        </div>

        {/* 3x2 grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
            >
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: f.bg }}
              >
                <f.icon size={26} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
