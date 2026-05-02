/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.png'

/*
  ─── tailwind.config.js – add inside theme.extend (same as Page404) ──────────
  keyframes: {
    pulse500:  { '0%,100%':{ transform:'scale(1)', opacity:1 }, '50%':{ transform:'scale(1.04)', opacity:.85 } },
    flickerOff:{ '0%,100%':{ opacity:1 }, '8%':{ opacity:.2 }, '16%':{ opacity:.9 }, '24%':{ opacity:.35 }, '32%':{ opacity:1 } },
    shake500:  {
      '0%,90%,100%':{ transform:'rotate(0deg)' },
      '92%':{ transform:'rotate(-2deg)' }, '94%':{ transform:'rotate(2deg)' },
      '96%':{ transform:'rotate(-1.5deg)' }, '98%':{ transform:'rotate(1.5deg)' },
    },
    blink:     { '0%,100%':{ opacity:1 }, '50%':{ opacity:.3 } },
    floatUp:   { '0%':{ opacity:0,transform:'translateY(0) scale(.5)' },'20%':{ opacity:.25 },'80%':{ opacity:.08 },'100%':{ opacity:0,transform:'translateY(-70px) scale(1.2)' } },
    shimmer500:{ '0%':{ backgroundPosition:'100% 0' },'100%':{ backgroundPosition:'-100% 0' } },
    scanline:  { '0%':{ transform:'translateY(-100%)' },'100%':{ transform:'translateY(400%)' } },
  },
  animation: {
    pulse500:   'pulse500 2.5s ease-in-out infinite',
    flickerOff: 'flickerOff 6s ease-in-out infinite',
    shake500:   'shake500 5s ease-in-out infinite',
    blink:      'blink 2s ease-in-out infinite',
    floatUp:    'floatUp var(--dur,4s) var(--delay,0s) ease-in-out infinite',
    shimmer500: 'shimmer500 4s linear infinite',
    scanline:   'scanline 3s linear infinite',
  },
  ─────────────────────────────────────────────────────────────────────────── */

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  top: `${10 + Math.random() * 80}%`,
  size: Math.floor(3 + Math.random() * 5),
  dur: `${(3 + Math.random() * 3).toFixed(1)}s`,
  del: `${(Math.random() * 4).toFixed(1)}s`,
  orange: i % 3 === 0,
}))

// Panel grid config: col × row → state
const PANEL_STATES = [
  ['ok', 'ok'],
  ['error', 'ok'],
  ['ok', 'dim'],
]

export default function Page500() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes pulse500   { 0%,100%{ transform:scale(1);opacity:1 } 50%{ transform:scale(1.04);opacity:.85 } }
        @keyframes flickerOff { 0%,100%{opacity:1} 8%{opacity:.2} 16%{opacity:.9} 24%{opacity:.35} 32%{opacity:1} }
        @keyframes shake500   { 0%,90%,100%{transform:rotate(0deg)} 92%{transform:rotate(-2deg)} 94%{transform:rotate(2deg)} 96%{transform:rotate(-1.5deg)} 98%{transform:rotate(1.5deg)} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes floatUp    { 0%{opacity:0;transform:translateY(0) scale(.5)} 20%{opacity:.25} 80%{opacity:.08} 100%{opacity:0;transform:translateY(-70px) scale(1.2)} }
        @keyframes shimmer500 { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
        @keyframes scanline   { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }

        .s5-pulse     { animation:pulse500   2.5s ease-in-out infinite }
        .s5-flicker   { animation:flickerOff 6s  ease-in-out infinite }
        .s5-shake     { animation:shake500   5s  ease-in-out infinite }
        .s5-blink     { animation:blink      2s  ease-in-out infinite }
        .s5-float     { animation:floatUp var(--dur,4s) var(--delay,0s) ease-in-out infinite }
        .s5-shimmer   { animation:shimmer500 4s  linear    infinite; background-size:200% 100% }
        .s5-scanline  { animation:scanline   3s  linear    infinite }

        .s5-num-grad {
          background:linear-gradient(135deg,#ff6600,#cc2200 45%,#ff8800);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .s5-grid-bg {
          background-image:
            linear-gradient(rgba(255,102,0,.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,102,0,.035) 1px,transparent 1px);
          background-size:44px 44px;
        }
      `}</style>

      {/* ══════════ ROOT ══════════ */}
      <div
        className="s5-grid-bg relative min-h-screen w-full overflow-hidden bg-[#faf9f7]"
        style={{ fontFamily: "'DM Sans',sans-serif" }}
      >
        {/* Top accent bar — red-orange for error feel */}
        <div
          className="fixed inset-x-0 top-0 z-50 h-[3px]"
          style={{
            background: 'linear-gradient(90deg,#cc2200 0%,#ff4400 30%,#ff8800 65%,#ffaa00 100%)',
          }}
        />

        {/* Ambient orbs */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(255,68,0,.12),transparent)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(255,136,0,.10),transparent)' }}
        />
        <div
          className="pointer-events-none absolute left-[20%] top-[30%] h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(0,130,53,.07),transparent)' }}
        />

        {/* Floating particles */}
        {mounted &&
          PARTICLES.map((p) => (
            <div
              key={p.id}
              className="s5-float pointer-events-none absolute rounded-full opacity-0"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                '--dur': p.dur,
                '--delay': p.del,
                background: p.orange ? '#ff6600' : '#cc2200',
              }}
            />
          ))}

        {/* ── Centre layout ── */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-10 pt-16">
          {/* ── Card ── */}
          <div
            className="w-full max-w-[540px] rounded-[22px] border border-[rgba(255,80,0,0.13)] bg-white/[0.93] px-6 py-10 text-center backdrop-blur-xl sm:px-12 sm:py-14"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,.04),0 16px 64px rgba(255,68,0,.08)' }}
          >
            {/* ── Logo ── */}
            <div className="mb-8 flex items-center justify-center gap-2.5">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
                style={{
                  background: 'linear-gradient(135deg,#008235,#00a844)',
                  boxShadow: '0 4px 14px rgba(0,130,53,.28)',
                }}
              >
                <img
                  src={logo}
                  alt="Star India Solar"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>
              <span
                className="text-[15px] font-bold tracking-[.01em] text-[#12241a]"
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                Star India <span className="text-[#ff6600]">Solar</span>
              </span>
            </div>

            {/* ── Server illustration ── */}
            <div className="relative mx-auto mb-7 flex items-end justify-center gap-3">
              {/* Server rack */}
              <div
                className="relative flex flex-col gap-[5px] rounded-[10px] border border-[rgba(255,80,0,.18)] bg-[#fff8f5] p-3"
                style={{ boxShadow: '0 4px 20px rgba(255,68,0,.08)' }}
              >
                {/* Scanline overlay */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
                  <div
                    className="s5-scanline absolute inset-x-0 h-[30%] rounded-[10px]"
                    style={{
                      background: 'linear-gradient(transparent,rgba(255,80,0,.06),transparent)',
                    }}
                  />
                </div>

                {/* Server units */}
                {[true, false, false].map((err, i) => (
                  <ServerUnit key={i} error={err} index={i} />
                ))}
              </div>

              {/* Solar panels — offline */}
              <div className="flex flex-col gap-2">
                <SolarPanel state="dim" />
                <SolarPanel state="error" />
              </div>

              {/* Warning badge */}
              <div
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#ff4400] bg-white text-sm font-bold text-[#ff4400]"
                style={{
                  boxShadow: '0 2px 10px rgba(255,68,0,.35)',
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                !
              </div>
            </div>

            {/* ── 500 number ── */}
            <div
              className="s5-shimmer s5-num-grad mb-1 leading-none tracking-[-4px]"
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(72px,18vw,96px)',
              }}
            >
              500
            </div>

            {/* Divider */}
            <div
              className="mx-auto mb-5 h-[3px] w-10 rounded-full"
              style={{ background: 'linear-gradient(90deg,#ff4400,#ff8800)' }}
            />

            {/* Heading */}
            <h1
              className="mb-2.5 text-[20px] font-bold text-[#2a1410] sm:text-[22px]"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              Internal Server Error
            </h1>

            {/* ── Buttons ── */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#ff6600] bg-transparent px-7 py-[11px] text-sm font-medium tracking-[.01em] text-[#ff6600] transition-all duration-200 hover:-translate-y-px hover:bg-[#fff7f2] active:translate-y-0"
              >
                <RefreshIcon className="h-4 w-4" />
                Try Again
              </button>
            </div>

          </div>

         
        </div>
      </div>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function ServerUnit({ error, index }) {
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-[6px] border px-3 py-2',
        error
          ? 's5-shake border-[rgba(255,68,0,.4)] bg-[rgba(255,68,0,.07)]'
          : 'border-[rgba(0,130,53,.18)] bg-[rgba(0,130,53,.04)]',
      ].join(' ')}
      style={{ width: 140 }}
    >
      {/* LED indicator */}
      <span
        className={[
          'h-2 w-2 flex-shrink-0 rounded-full',
          error ? 's5-blink bg-[#ff4400]' : 'bg-[#00c853]',
        ].join(' ')}
        style={
          error
            ? { boxShadow: '0 0 0 2px rgba(255,68,0,.25)' }
            : { boxShadow: '0 0 0 2px rgba(0,200,83,.2)' }
        }
      />
      {/* Slots */}
      <div className="flex flex-1 flex-col gap-[3px]">
        {[0, 1].map((k) => (
          <div
            key={k}
            className={[
              'h-[4px] rounded-full',
              error && k === 0 ? 's5-flicker bg-[#ff8800]' : 'bg-[rgba(0,130,53,.25)]',
            ].join(' ')}
            style={error && k === 0 ? { width: '75%' } : { width: k === 0 ? '90%' : '60%' }}
          />
        ))}
      </div>
      {/* Fan icon shape */}
      <div
        className={[
          'h-4 w-4 flex-shrink-0 rounded-full border',
          error
            ? 'border-[#ff6600] bg-[rgba(255,102,0,.15)]'
            : 'border-[rgba(0,130,53,.3)] bg-[rgba(0,130,53,.08)]',
        ].join(' ')}
      />
    </div>
  )
}

function SolarPanel({ state = 'ok' }) {
  const isError = state === 'error'
  const isDim = state === 'dim'
  return (
    <div
      className={[
        'relative grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[6px] border-[1.5px] p-[5px]',
        isError
          ? 's5-shake border-[#ff4400] bg-gradient-to-br from-[#fff0ee] to-[#ffddd8]'
          : isDim
            ? 'border-[rgba(255,102,0,.35)] bg-gradient-to-br from-[#fff8f5] to-[#fff0e8] opacity-50'
            : 'border-[#008235] bg-gradient-to-br from-[#e8f5ee] to-[#d0eddd]',
      ].join(' ')}
      style={{ width: 48, height: 38 }}
    >
      {[0, 1, 2, 3].map((k) => (
        <div
          key={k}
          className={[
            'rounded-[2px]',
            isError
              ? 'bg-[rgba(255,68,0,0.22)]'
              : isDim
                ? 'bg-[rgba(255,102,0,0.12)]'
                : 'bg-[rgba(0,130,53,0.18)]',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

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

function RefreshIcon({ className }) {
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
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}
