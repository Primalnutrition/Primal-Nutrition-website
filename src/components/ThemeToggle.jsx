import { useState } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const active = themes.find((t) => t.id === theme) || themes[0]

  return (
    <div className="fixed bottom-6 left-6 z-[55]">
      <div
        className={`bg-ink-800/95 backdrop-blur-xl border border-bone/15 rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-all duration-400 ${
          expanded ? 'p-4 w-[280px]' : 'p-2 w-auto'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
      >
        {expanded && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-bone/55 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-shimmer" />
              Theme · A/B/C test
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Collapse theme picker"
              className="w-6 h-6 flex items-center justify-center rounded-full text-bone/40 hover:text-bone hover:bg-bone/5 transition"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        )}

        {expanded ? (
          <>
            <div className="space-y-2">
              {themes.map((t) => {
                const isActive = t.id === theme
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'border-amber bg-amber/10'
                        : 'border-bone/10 hover:border-bone/30 hover:bg-bone/[0.02]'
                    }`}
                  >
                    {/* Swatch */}
                    <div className="flex flex-shrink-0">
                      {t.swatch.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-7 -ml-1 first:ml-0 rounded-sm border border-bone/10"
                          style={{ backgroundColor: color, zIndex: 4 - i }}
                        />
                      ))}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-bold text-amber text-base">{t.label}</span>
                        <span className="font-display font-semibold text-bone text-sm truncate">{t.name}</span>
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-bone/45 mt-0.5">{t.sub}</div>
                      <div className="text-[10px] text-bone/35 mt-0.5 italic">{t.reads}</div>
                    </div>

                    {/* Active dot */}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-amber shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            <p className="text-[10px] text-bone/35 mt-3 leading-relaxed">
              Preference persists across sessions. Use this for client demos and 4-week split tests.
            </p>
          </>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            aria-label="Open theme picker"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-bone/5 transition group"
          >
            {/* Mini swatch */}
            <div className="flex shrink-0">
              {active.swatch.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-5 -ml-0.5 first:ml-0 rounded-[2px] border border-bone/10"
                  style={{ backgroundColor: color, zIndex: 4 - i }}
                />
              ))}
            </div>
            <div className="text-left pr-1">
              <div className="text-[9px] uppercase tracking-widest text-bone/45 leading-none">Theme</div>
              <div className="font-display font-bold text-sm text-bone group-hover:text-amber transition leading-none mt-0.5">
                {active.label} · {active.name}
              </div>
            </div>
            <svg className="w-3 h-3 text-bone/40 group-hover:text-amber transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
          </button>
        )}
      </div>
    </div>
  )
}
