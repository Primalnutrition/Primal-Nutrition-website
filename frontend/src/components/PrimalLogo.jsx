/* Primal Nutrition logo mark — two hexagons forming an infinity symbol.
   Inline SVG with blue → purple → red gradient.
   Transparent background — works on any surface without blend-mode hacks. */
export default function PrimalLogo({ className = 'h-11 w-auto' }) {
  return (
    <svg
      viewBox="0 0 700 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Primal Nutrition"
      role="img"
    >
      <defs>
        <linearGradient
          id="pn-hx"
          x1="0" y1="0" x2="700" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#2035D0" />
          <stop offset="28%"  stopColor="#6B22DC" />
          <stop offset="50%"  stopColor="#9320CE" />
          <stop offset="72%"  stopColor="#C41C2A" />
          <stop offset="100%" stopColor="#E21820" />
        </linearGradient>
      </defs>

      {/* ── Layer 1: right hexagon (sits behind at the top crossing) ── */}
      <polygon
        points="337,220 421,74.5 589,74.5 673,220 589,365.5 421,365.5"
        fill="none"
        stroke="url(#pn-hx)"
        strokeWidth="50"
        strokeLinejoin="round"
      />

      {/* ── Layer 2: left hexagon (sits on top at the top crossing) ── */}
      <polygon
        points="27,220 111,74.5 279,74.5 363,220 279,365.5 111,365.5"
        fill="none"
        stroke="url(#pn-hx)"
        strokeWidth="50"
        strokeLinejoin="round"
      />

      {/* ── Layer 3: right hex lower-left edge redrawn on top ──
           Produces the infinity weave: right hex crosses OVER left hex
           at the bottom crossing point (~350, 243).               ── */}
      <line
        x1="337" y1="220" x2="421" y2="365.5"
        stroke="url(#pn-hx)"
        strokeWidth="50"
        strokeLinecap="butt"
      />
    </svg>
  )
}
