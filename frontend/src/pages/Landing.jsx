import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col overflow-x-hidden transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-600/30">
              SP
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Smart Park</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 rounded-lg flex items-center justify-center
                         bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700
                         hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="text-sm">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
            <a href="/login" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2">
              Sign In
            </a>
            <a href="/signup" className="btn-primary text-sm px-5 py-2">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 rounded-full px-4 py-1.5 text-sm text-blue-600 dark:text-blue-400 mb-8">
            🅿️ <span>India's Smartest Parking Network</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
            Find Your Parking<br />
            <span className="bg-gradient-to-r from-blue-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Spot in Seconds
            </span>
          </h1>

          <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse hundreds of verified parking lots across 6 major Indian states.
            Real-time slot availability, easy booking, no hassle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup"
              className="btn-primary px-8 py-4 text-base rounded-xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-0.5">
              🚀 Start Parking Free
            </a>
            <a href="/login"
              className="btn-secondary px-8 py-4 text-base rounded-xl hover:-translate-y-0.5 transition-all duration-300">
              Sign In to Account
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { number: '36+', label: 'Parking Lots' },
            { number: '6',   label: 'States' },
            { number: '650+', label: 'Total Slots' },
            { number: '24/7', label: 'Availability' },
          ].map(({ number, label }) => (
            <div key={label}>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{number}</p>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* States */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-3">Available Cities</h2>
          <p className="text-slate-500 dark:text-gray-400 text-center mb-12">Parking lots across major Indian cities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { state: 'Maharashtra', city: 'Mumbai · Pune', emoji: '🏙️' },
              { state: 'Delhi', city: 'New Delhi', emoji: '🏛️' },
              { state: 'Karnataka', city: 'Bangalore', emoji: '🌆' },
              { state: 'Tamil Nadu', city: 'Chennai', emoji: '🌊' },
              { state: 'Gujarat', city: 'Ahmedabad', emoji: '🏗️' },
              { state: 'Rajasthan', city: 'Jaipur', emoji: '🏰' },
            ].map(({ state, city, emoji }) => (
              <div key={state}
                className="card hover:border-blue-600/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center">
                <p className="text-3xl mb-2">{emoji}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{state}</p>
                <p className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">{city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Why Smart Park?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Real-Time Search', desc: 'Find available slots instantly filtered by state, price, and distance.' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Book a specific slot in seconds. No waiting, no uncertainty.' },
              { icon: '📊', title: 'Manager Dashboard', desc: 'Full analytics, booking management, and lot controls in one place.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card hover:border-blue-600/40 transition-colors">
                <p className="text-4xl mb-4">{icon}</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card border-blue-600/30">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to park smarter?</h2>
            <p className="text-slate-500 dark:text-gray-400 mb-8">Join thousands of drivers who use Smart Park daily.</p>
            <a href="/signup" className="btn-primary px-10 py-4 text-base rounded-xl inline-block">
              Create Free Account →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-8 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">SP</div>
            <span className="text-sm text-slate-400 dark:text-gray-400">Smart Park © 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400 dark:text-gray-500">
            <a href="/login" className="hover:text-slate-700 dark:hover:text-gray-300 transition-colors">Sign In</a>
            <a href="/signup" className="hover:text-slate-700 dark:hover:text-gray-300 transition-colors">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
