/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import logo from '../../../assets/logo.png'  // ← uncomment & set your logo path

/*
  ─── tailwind.config.js – add inside theme.extend ───────────────────────────
  keyframes: {
    pulse404: {
      '0%,100%': { transform:'scale(1)', boxShadow:'0 0 0 4px rgba(255,170,0,.2),0 0 24px rgba(255,136,0,.35)' },
      '50%':     { transform:'scale(1.05)',boxShadow:'0 0 0 8px rgba(255,170,0,.14),0 0 40px rgba(255,136,0,.5)' },
    },
    rayBlink: { '0%,100%':{ opacity:.55 }, '50%':{ opacity:1 } },
    shake: {
      '0%,88%,100%':{ transform:'rotate(0deg)' },
      '90%':{ transform:'rotate(-1.5deg)' },
      '93%':{ transform:'rotate(1.5deg)' },
      '96%':{ transform:'rotate(-1deg)' },
      '99%':{ transform:'rotate(.8deg)' },
    },
    blink: { '0%,100%':{ opacity:1 }, '50%':{ opacity:.3 } },
    floatUp: {
      '0%':  { opacity:0, transform:'translateY(0) scale(.5)' },
      '20%': { opacity:.3 },
      '80%': { opacity:.1 },
      '100%':{ opacity:0, transform:'translateY(-70px) scale(1.2)' },
    },
    shimmer: {
      '0%':  { backgroundPosition:'100% 0' },
      '100%':{ backgroundPosition:'-100% 0' },
    },
  },
  animation: {
    pulse404: 'pulse404 3s ease-in-out infinite',
    rayBlink: 'rayBlink 3s ease-in-out infinite',
    shake:    'shake 5s ease-in-out infinite',
    blink:    'blink 2s ease-in-out infinite',
    floatUp:  'floatUp var(--dur,4s) var(--delay,0s) ease-in-out infinite',
    shimmer:  'shimmer 4s linear infinite',
  },
  ─────────────────────────────────────────────────────────────────────────── */

const SUN_RAYS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: i * 30,
  len: 14 + (i % 3) * 4,
  delay: `${(i * 0.2).toFixed(1)}s`,
}))

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  top: `${10 + Math.random() * 80}%`,
  size: Math.floor(3 + Math.random() * 5),
  dur: `${(3 + Math.random() * 3).toFixed(1)}s`,
  del: `${(Math.random() * 3).toFixed(1)}s`,
}))

export default function Page404() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      {/* ── Google Fonts ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* ── Global keyframes (only what Tailwind JIT can't purge-safe inline) ── */}
      <style>{`
        @keyframes pulse404 {
          0%,100%{ transform:scale(1); box-shadow:0 0 0 4px rgba(255,170,0,.2),0 0 24px rgba(255,136,0,.35) }
          50%    { transform:scale(1.05); box-shadow:0 0 0 8px rgba(255,170,0,.14),0 0 40px rgba(255,136,0,.5) }
        }
        @keyframes rayBlink { 0%,100%{ opacity:.55 } 50%{ opacity:1 } }
        @keyframes shake {
          0%,88%,100%{ transform:rotate(0deg) }
          90%{ transform:rotate(-1.5deg) } 93%{ transform:rotate(1.5deg) }
          96%{ transform:rotate(-1deg)  } 99%{ transform:rotate(.8deg)  }
        }
        @keyframes blink   { 0%,100%{ opacity:1 }   50%{ opacity:.3 } }
        @keyframes floatUp {
          0%  { opacity:0;   transform:translateY(0) scale(.5) }
          20% { opacity:.3  }
          80% { opacity:.1  }
          100%{ opacity:0;   transform:translateY(-70px) scale(1.2) }
        }
        @keyframes shimmer { 0%{ background-position:100% 0 } 100%{ background-position:-100% 0 } }

        .sis-pulse404 { animation:pulse404 3s ease-in-out infinite }
        .sis-rayBlink { animation:rayBlink 3s ease-in-out infinite }
        .sis-shake    { animation:shake 5s ease-in-out infinite }
        .sis-blink    { animation:blink 2s ease-in-out infinite }
        .sis-float    { animation:floatUp var(--dur,4s) var(--delay,0s) ease-in-out infinite }
        .sis-shimmer  { animation:shimmer 4s linear infinite; background-size:200% 100% }
        .sis-num-grad {
          background:linear-gradient(135deg,#ff6600,#ff9900 40%,#008235);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .sis-grid-bg {
          background-image:
            linear-gradient(rgba(0,130,53,.045) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,130,53,.045) 1px,transparent 1px);
          background-size:44px 44px;
        }
      `}</style>

      {/* ══════════════ ROOT ══════════════ */}
      <div
        className="sis-grid-bg relative min-h-screen w-full overflow-hidden bg-[#f7f9f4]"
        style={{ fontFamily: "'DM Sans',sans-serif" }}
      >
        {/* Top accent bar */}
        <div
          className="fixed inset-x-0 top-0 z-50 h-[3px]"
          style={{
            background: 'linear-gradient(90deg,#008235 0%,#00a844 30%,#ffaa00 65%,#ff6600 100%)',
          }}
        />

        {/* Ambient orbs */}
        <div
          className="pointer-events-none absolute -left-24 -top-28 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(0,130,53,.14),transparent)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(255,102,0,.12),transparent)' }}
        />
        <div
          className="pointer-events-none absolute left-[55%] top-[40%] h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(255,170,0,.09),transparent)' }}
        />

        {/* Floating particles */}
        {mounted &&
          PARTICLES.map((p) => (
            <div
              key={p.id}
              className="sis-float pointer-events-none absolute rounded-full bg-[#008235] opacity-0"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                '--dur': p.dur,
                '--delay': p.del,
              }}
            />
          ))}

        {/* ── Centre layout ── */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-10 pt-16">
          {/* ── Card ── */}
          <div
            className="w-full max-w-[540px] rounded-[22px] border border-[rgba(0,130,53,0.13)] bg-white/[0.93] px-6 py-10 text-center backdrop-blur-xl sm:px-12 sm:py-14"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,.04),0 16px 64px rgba(0,130,53,.09)' }}
          >
            {/* ── Logo ── */}
            <div className="mb-8 flex items-center justify-center gap-2.5">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px]"
                style={{
                  background: 'linear-gradient(135deg,#008235,#00a844)',
                  boxShadow: '0 4px 14px rgba(0,130,53,.3)',
                }}
              >
                <SunIcon className="h-5 w-5 text-white" />
              </div>
              {/* swap with <img src={logo} alt="Star India Solar" className="h-8" /> if needed */}
              <span
                className="text-[15px] font-bold tracking-[.01em] text-[#12241a]"
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                Star India <span className="text-[#ff6600]">Solar</span>
              </span>
            </div>

            {/* ── Animated sun ── */}
            <div className="relative mx-auto mb-6 h-[100px] w-[100px]">
              {SUN_RAYS.map((r) => (
                <div
                  key={r.id}
                  className="sis-rayBlink absolute rounded-full"
                  style={{
                    width: 2.5,
                    height: r.len,
                    left: 'calc(50% - 1.25px)',
                    top: `calc(50% - ${28 + r.len}px)`,
                    transform: `rotate(${r.angle}deg)`,
                    transformOrigin: `1.25px ${r.len + 28}px`,
                    animationDelay: r.delay,
                    background: 'linear-gradient(to top,#ffaa00,transparent)',
                  }}
                />
              ))}
              <div
                className="sis-pulse404 absolute inset-5 rounded-full"
                style={{ background: 'linear-gradient(135deg,#ffdd44,#ff8800)' }}
              />
            </div>

            {/* ── Solar panels ── */}
            <div className="mb-7 flex items-center justify-center gap-2.5">
              <SolarPanel />
              <SolarPanel broken />
              <SolarPanel />
            </div>

            {/* ── 404 ── */}
            <div
              className="sis-shimmer sis-num-grad mb-1 leading-none tracking-[-4px]"
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(72px,18vw,96px)',
              }}
            >
              404
            </div>

            {/* Divider */}
            <div
              className="mx-auto mb-5 h-[3px] w-10 rounded-full"
              style={{ background: 'linear-gradient(90deg,#ff6600,#008235)' }}
            />

            {/* Heading */}
            <h1
              className="mb-2.5 text-[20px] font-bold text-[#12241a] sm:text-[22px]"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              Page Not Found
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-[340px] text-sm font-light leading-[1.85] text-[#6b7c72]">

            </p>

            {/* ── Buttons ── */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#ff6600] bg-transparent px-7 py-[11px] text-sm font-medium tracking-[.01em] text-[#ff6600] transition-all duration-200 hover:-translate-y-px hover:bg-[#fff7f2] active:translate-y-0"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Go Back
              </button>
            </div>

           
          </div>

         
        </div>
      </div>
    </>
  )
}

/* ── Reusable sub-components ──────────────────────────────────────────────── */

function SolarPanel({ broken = false }) {
  return (
    <div
      className={[
        'relative grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[6px] border-[1.5px] p-[5px]',
        broken
          ? 'sis-shake border-[#ff6600] bg-gradient-to-br from-[#fff3ec] to-[#ffe8d6]'
          : 'border-[#008235] bg-gradient-to-br from-[#e8f5ee] to-[#d0eddd]',
      ].join(' ')}
      style={{ width: 52, height: 40 }}
    >
      {[0, 1, 2, 3].map((k) => (
        <div
          key={k}
          className={[
            'rounded-[2px]',
            broken ? 'bg-[rgba(255,102,0,0.2)]' : 'bg-[rgba(0,130,53,0.18)]',
          ].join(' ')}
        />
      ))}
      {broken && (
        <span
          className="absolute -right-[10px] -top-[10px] flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold leading-none text-white"
          style={{ background: '#ff6600', boxShadow: '0 2px 8px rgba(255,102,0,.4)' }}
        >
          !
        </span>
      )}
    </div>
  )
}

function SunIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      {[
        [12, 2, 12, 6],
        [12, 18, 12, 22],
        [2, 12, 6, 12],
        [18, 12, 22, 12],
        [4.93, 4.93, 7.76, 7.76],
        [16.24, 16.24, 19.07, 19.07],
        [19.07, 4.93, 16.24, 7.76],
        [7.76, 16.24, 4.93, 19.07],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

function HomeIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ChevronLeftIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
