import Image from 'next/image'
import Link from 'next/link'

export function AuthLayout({
  children,
  title,
  subtitle,
  illustration,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
  illustration?: React.ReactNode
}) {
  return (
    <div className="landing min-h-screen flex text-gray-900 bg-white">
      {/* Left Column — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative">
        {/* Logo for mobile */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">TaskIQ</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>

      {/* Right Column — Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-50/50 p-12 flex-col justify-between relative overflow-hidden">
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center shadow-lg shadow-teal/20 transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">TaskIQ</span>
          </Link>
        </div>

        {/* Dynamic Illustration / Visuals */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-lg mx-auto">
          {illustration || (
            <div className="w-full relative">
              {/* Default abstract dash/stats graphic if no slot provided */}
              <div className="glass-panel w-full p-8 rounded-2xl shadow-xl relative z-10 bg-white border border-gray-100">
                <div className="h-4 w-1/3 bg-gray-100 rounded-full mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-3 w-full bg-gray-100 rounded-full mb-2"></div>
                        <div className="h-3 w-2/3 bg-gray-50 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal/10 rounded-full blur-3xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-accent/10 rounded-full blur-3xl z-0"></div>
            </div>
          )}

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Make your work easier and organized
            </h2>
            <p className="text-gray-500 font-medium">
              with <span className="text-teal font-bold">TaskIQ Platform</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
