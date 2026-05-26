/* Uses the official Primal Nutrition logo PNG from /brand/primal-logo.png.
   mix-blend-mode: lighten hides the PNG's black background on dark theme
   surfaces, leaving only the gradient hexagons + white wordmark visible.   */
export default function PrimalLogo({ className = 'w-11 h-11', wordmarkOnly = false }) {
  return (
    <img
      src="/brand/primal-logo.png"
      alt="Primal Nutrition"
      className={`object-contain ${className}`}
      style={{ mixBlendMode: 'lighten' }}
    />
  )
}
