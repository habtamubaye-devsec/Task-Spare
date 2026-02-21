import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 lg:px-12">
        <span className="text-xl font-bold tracking-tight text-foreground">
          TaskSpare
        </span>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl text-balance">
          Ship work together,{' '}
          <span className="text-primary">without the chaos</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Tasks, projects, and your team in one place. Simple, fast, and built for how you work.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-border bg-card/50 px-6 py-3 text-base font-semibold transition hover:bg-card"
          >
            Sign in
          </Link>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TaskSpare. Built for teams.
      </footer>
    </div>
  )
}
