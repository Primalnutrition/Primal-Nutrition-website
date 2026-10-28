import { usePage } from '../context/RouterContext.jsx'
import { BENEFIT_ICONS } from '../lib/benefitIcons.jsx'

/* "Sound familiar?" — five everyday problems, one honest line each, and the
   products that answer them. Detail lives on the product pages. */
const PROBLEMS = [
  {
    icon: 'bolt',
    hook: 'Tired by 3 PM?',
    truth: 'Coffee and energy drinks spike you up, then crash you down.',
    answer: 'Steady, all-day energy. No stimulants.',
    products: [['trex-liquid', 'T-REX'], ['trex-cordyceps', 'Cordyceps']],
  },
  {
    icon: 'flame',
    hook: 'Lost your drive?',
    truth: 'Testosterone gradually declines with age, and most men just call it getting older.',
    answer: 'Natural support for drive, desire and confidence.',
    products: [['trex-tongkat', 'Tongkat Ali'], ['trex-maca', 'Black Maca']],
  },
  {
    icon: 'leaf',
    hook: 'Stressed, never rested?',
    truth: 'High stress keeps cortisol up and steals your sleep and your strength.',
    answer: 'Calm energy and deeper sleep.',
    products: [['trex-liquid', 'T-REX'], ['trex-ginseng', 'Korean Ginseng']],
  },
  {
    icon: 'dumbbell',
    hook: 'Stuck in the gym?',
    truth: 'Same effort, same weights, slower recovery.',
    answer: 'More strength, more stamina, faster recovery.',
    products: [['trex-tongkat', 'Tongkat Ali'], ['hydra-muscle', 'Hydra Muscle']],
  },
  {
    icon: 'arm',
    hook: 'Running on fumes?',
    truth: 'Long days, late nights and poor food take their toll.',
    answer: 'Everyday vitality and a body that bounces back.',
    products: [['trex-royal-jelly', 'Royal Jelly'], ['trex-liver', 'Liver Detox']],
  },
]

export default function HomeProblems() {
  const { navigate } = usePage()
  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="max-w-2xl mb-12">
          <div className="eyebrow mb-5">Sound familiar?</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tightest leading-[1.02]">
            Real problems.<br /><span className="text-shimmer">Real answers.</span>
          </h2>
        </div>
        <div data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {PROBLEMS.map((p) => (
            <article key={p.hook} className="p-6 lg:p-7 rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/[0.07] via-ink-800/60 to-ink flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center mb-5">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-amber" aria-hidden>
                  {BENEFIT_ICONS[p.icon]}
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl leading-tight mb-2">{p.hook}</h3>
              <p className="text-[15px] text-bone/60 leading-relaxed mb-3">{p.truth}</p>
              <p className="text-[15px] text-bone/90 leading-relaxed mb-5 flex-1">{p.answer}</p>
              <div className="flex flex-wrap gap-2">
                {p.products.map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => navigate('product', { id })}
                    className="px-4 py-2 rounded-full border border-bone/15 text-[12px] uppercase tracking-widest text-bone/80 hover:border-amber hover:text-amber transition"
                  >
                    {name} →
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
