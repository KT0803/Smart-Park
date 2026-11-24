import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';

const CITIES = [
  { code: 'MH', state: 'Maharashtra', city: 'Mumbai, Pune' },
  { code: 'DL', state: 'Delhi', city: 'New Delhi' },
  { code: 'KA', state: 'Karnataka', city: 'Bangalore' },
  { code: 'TN', state: 'Tamil Nadu', city: 'Chennai' },
  { code: 'GJ', state: 'Gujarat', city: 'Ahmedabad' },
  { code: 'RJ', state: 'Rajasthan', city: 'Jaipur' },
];

const STEPS = [
  { title: 'Search', desc: 'Filter lots by state, price per hour or name. Free slot counts refresh every 30 seconds.' },
  { title: 'Pick a slot', desc: 'Choose the exact slot you want and enter your number plate.' },
  { title: 'Park', desc: 'Cancel within a minute of booking and it costs nothing.' },
];

const TICKER = ['Mumbai', 'Pune', 'New Delhi', 'Bangalore', 'Chennai', 'Ahmedabad', 'Jaipur'];

// Car colours for the hero illustration
const CARS = {
  0: '#b5472f', 2: '#3b6a99', 3: '#6b675d', 5: '#3f7d58',
  7: '#c98a00', 9: '#7a5c8e', 10: '#b5472f',
};

function Car({ x, y, color, flip }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="9" y="10" width="46" height="90" rx="12" fill={color} className="stroke-ink" strokeWidth="2" />
      <rect x="15" y={flip ? 62 : 22} width="34" height="22" rx="5" className="fill-paper" opacity="0.85" />
      <rect x="15" y={flip ? 28 : 66} width="34" height="12" rx="4" className="fill-ink" opacity="0.35" />
    </g>
  );
}

function ParkingLot() {
  const slotW = 64;
  const top = Array.from({ length: 6 }, (_, i) => i);
  const bottom = Array.from({ length: 6 }, (_, i) => i + 6);
  return (
    <svg viewBox="0 0 400 340" className="w-full h-auto" role="img"
      aria-label="Illustration of a parking lot with one free slot">
      {/* asphalt */}
      <rect x="2" y="2" width="396" height="336" rx="6" className="fill-ink" />
      {/* lane dashes */}
      <line x1="14" y1="170" x2="386" y2="170" stroke="#f2b705" strokeWidth="3" strokeDasharray="16 12" />

      {/* top row (cars face down) */}
      {top.map((i) => (
        <g key={i}>
          <rect x={8 + i * slotW} y="10" width={slotW} height="110" fill="none" stroke="#f3efe6" strokeWidth="2" opacity="0.7" />
          {CARS[i] && <Car x={8 + i * slotW} y={10} color={CARS[i]} />}
        </g>
      ))}

      {/* bottom row (cars face up) */}
      {bottom.map((i) => {
        const x = 8 + (i - 6) * slotW;
        const free = i === 8;
        return (
          <g key={i}>
            <rect x={x} y="220" width={slotW} height="110"
              fill={free ? '#f2b705' : 'none'} fillOpacity={free ? 0.9 : 0}
              stroke="#f3efe6" strokeWidth="2" opacity={free ? 1 : 0.7} />
            {free && (
              <text x={x + slotW / 2} y="282" textAnchor="middle" fontFamily="Archivo" fontWeight="800"
                fontSize="19" fill="#1c1b18">B-14</text>
            )}
            {CARS[i] && <Car x={x} y={220} color={CARS[i]} flip />}
          </g>
        );
      })}

      {/* car arriving + path to the free slot */}
      <path d="M 40 150 C 120 150, 150 150, 200 190 S 232 232, 232 240" fill="none"
        stroke="#f2b705" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      <g transform="translate(18 128) rotate(-90 32 55) scale(0.62)">
        <Car x={0} y={0} color="#f3efe6" flip />
      </g>
    </svg>
  );
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-5 text-sm">
            <button onClick={toggleTheme} className="text-muted hover:text-ink">
              {theme === 'dark' ? 'Light theme' : 'Dark theme'}
            </button>
            <a href="/login" className="font-medium hover:underline underline-offset-4">Sign in</a>
            <a href="/signup" className="btn-primary !py-1.5">Sign up</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto w-full px-5 pt-14 pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div>
          <p className="inline-block font-mono text-xs uppercase tracking-widest border border-ink rounded-sm px-2 py-1 mb-6 -rotate-1 bg-surface">
            36 lots / 6 states
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.02] mb-6">
            Book your spot{' '}
            <span className="relative whitespace-nowrap">
              <span className="absolute inset-x-[-6px] bottom-1 top-[45%] bg-accent -z-10 -rotate-1" aria-hidden="true" />
              before
            </span>{' '}
            you get there.
          </h1>
          <p className="text-lg text-muted max-w-md mb-8">
            See which slots are free, pick one and drive straight in. No circling the block.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/signup" className="btn-primary !px-7 !py-3.5 !text-base">Create an account</a>
            <a href="/login" className="btn-secondary !px-7 !py-3.5 !text-base">Sign in</a>
          </div>
        </div>

        <div className="relative">
          <div className="rotate-1" style={{ filter: 'drop-shadow(6px 6px 0 rgb(var(--ink) / 0.9))' }}>
            <ParkingLot />
          </div>
          {/* ticket */}
          <div className="hidden sm:block absolute -bottom-8 -left-6 w-48 -rotate-3 bg-surface border-[1.5px] border-ink rounded-sm"
            style={{ boxShadow: '4px 4px 0 rgb(var(--ink))' }} aria-hidden="true">
            <div className="px-3 py-1.5 border-b-[1.5px] border-dashed border-ink font-mono text-[10px] uppercase tracking-wider flex justify-between">
              <span>Smart Park</span><span>Ticket</span>
            </div>
            <div className="px-3 py-3">
              <p className="font-mono text-[10px] uppercase text-muted">Slot</p>
              <p className="text-3xl font-extrabold leading-none">B-14</p>
              <p className="font-mono text-sm mt-2">MH 01 AB 1234</p>
              <p className="font-mono text-xs text-muted mt-0.5">₹40 / hr</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hazard stripe */}
      <div aria-hidden="true" className="h-3"
        style={{ background: 'repeating-linear-gradient(-45deg, #f2b705 0 14px, #1c1b18 14px 28px)' }} />

      {/* Ticker */}
      <div className="bg-accent text-[#1c1b18] border-b-[1.5px] border-ink overflow-hidden" aria-hidden="true">
        <div className="flex w-max animate-marquee py-3 font-extrabold uppercase tracking-wide">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0">
              {TICKER.map((c) => (
                <span key={c + n} className="px-6 flex items-center gap-12">
                  {c} <span>P</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <section className="bg-ink text-paper">
        <dl className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-2 sm:grid-cols-4 gap-y-8">
          {[
            ['36+', 'parking lots'],
            ['6', 'states'],
            ['650+', 'slots'],
            ['24/7', 'booking'],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-mono text-5xl text-accent">{n}</dt>
              <dd className="text-sm opacity-70 mt-1">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto w-full px-5 py-24">
        <h2 className="text-4xl font-extrabold mb-12">Three steps, that's it.</h2>
        <ol className="grid sm:grid-cols-3 gap-6">
          {STEPS.map(({ title, desc }, i) => (
            <li key={title} className="card !p-6 relative" style={{ boxShadow: '4px 4px 0 rgb(var(--ink))', borderColor: 'rgb(var(--ink))' }}>
              <span className="absolute -top-5 -left-3 w-11 h-11 rounded-full bg-accent text-[#1c1b18] border-[1.5px] border-ink font-extrabold text-xl flex items-center justify-center">
                {i + 1}
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2">{title}</h3>
              <p className="text-muted leading-relaxed">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Cities as number plates */}
      <section className="border-t border-line bg-surface">
        <div className="max-w-6xl mx-auto w-full px-5 py-24">
          <h2 className="text-4xl font-extrabold mb-2">Where you can park</h2>
          <p className="text-muted mb-10">Lots in six states, and growing.</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {CITIES.map(({ code, state, city }) => (
              <li key={code}
                className="flex items-center gap-4 bg-paper border-[1.5px] border-ink rounded p-3 hover:-translate-y-0.5 transition-transform">
                <span className="font-mono font-medium text-2xl bg-accent text-[#1c1b18] border-[1.5px] border-ink rounded-sm px-2.5 py-1.5 tracking-widest">
                  {code}
                </span>
                <span>
                  <span className="block font-bold leading-tight">{state}</span>
                  <span className="block text-sm text-muted">{city}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent text-[#1c1b18] border-y-[1.5px] border-ink">
        <div className="max-w-6xl mx-auto px-5 py-16 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-lg">
            Skip the hunt for a spot.
          </h2>
          <a href="/signup"
            className="self-start inline-flex bg-[#1c1b18] text-[#f3efe6] font-bold text-base px-8 py-4 rounded border-[1.5px] border-[#1c1b18] hover:-translate-y-0.5 transition-transform"
            style={{ boxShadow: '4px 4px 0 rgba(28,27,24,0.35)' }}>
            Create an account
          </a>
        </div>
      </section>

      <footer className="py-6 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <span>Smart Park, 2026</span>
          <div className="flex gap-5">
            <a href="/login" className="hover:text-ink">Sign in</a>
            <a href="/signup" className="hover:text-ink">Sign up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
