import { usePage } from '../context/RouterContext.jsx'

/* "Sound familiar?" — five everyday problems, one honest line each, and the
   products that answer them. Detail lives on the product pages. */
const PROBLEMS = [
  {
    hook: 'Tired by 3 PM?',
    truth: 'Coffee and energy drinks spike you up, then crash you down.',
    answer: 'Steady, all-day energy. No stimulants.',
    products: [['trex-liquid', 'T-REX'], ['trex-cordyceps', 'Cordyceps']],
  },
  {
    hook: 'Lost your drive?',
    truth: 'Testosterone gradually declines with age, and most men just call it getting older.',
    answer: 'Natural support for drive, desire and confidence.',
    products: [['trex-tongkat', 'Tongkat Ali'], ['trex-maca', 'Black Maca']],
  },
  {
    hook: 'Stressed, never rested?',
    truth: 'High stress keeps cortisol up and steals your sleep and your strength.',
    answer: 'Calm energy and deeper sleep.',
    products: [['trex-liquid', 'T-REX'], ['trex-ginseng', 'Korean Ginseng']],
  },
  {
    hook: 'Stuck in the gym?',
    truth: 'Same effort, same weights, slower recovery.',
    answer: 'More strength, more stamina, faster recovery.',
    products: [['trex-tongkat', 'Tongkat Ali'], ['hydra-muscle', 'Hydra Muscle']],
  },
  {
    hook: 'Running on fumes?',
    truth: 'Long days, late nights and poor food take their toll.',
    answer: 'Everyday vitality and a body that bounces back.',
    products: [['trex-royal-jelly', 'Royal Jelly'], ['trex-liver', 'Liver Detox']],
  },
]

/* Editorial list on a warm cream band — deliberately unlike the dark icon-card
   grids on the product pages: big numbered questions, hairline dividers, and
   the answer + products as quiet text links. */
export default function HomeProblems() {
  const { navigate } = usePage()
  return (
    <section className="py-20 lg:py-28 bg-[#F3EEE6] text-ink">
      <div className="container-x">
        <div className="max-w-2xl mb-10 lg:mb-14">
          <div className="eyebrow mb-5 text-amber">Sound familiar?</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tightest leading-[1.02] text-ink">
            Real problems.<br /><span className="text-amber">Real answers.</span>
          </h2>
        </div>
        <ol className="border-t border-ink/15">
          {PROBLEMS.map((p, i) => (
            <li key={p.hook} className="grid lg:grid-cols-12 gap-x-10 gap-y-3 py-8 lg:py-10 border-b border-ink/15">
              <div className="lg:col-span-5 flex items-baseline gap-5">
                <span className="font-display text-sm text-ink/40 tracking-widest">0{i + 1}</span>
                <h3 className="font-display font-bold text-3xl lg:text-5xl tracking-tightest leading-[1.02] text-ink">{p.hook}</h3>
              </div>
              <div className="lg:col-span-7 pl-10 lg:pl-0">
                <p className="text-[15px] lg:text-base text-ink/55 leading-relaxed">{p.truth}</p>
                <p className="text-lg lg:text-xl text-ink leading-snug mt-2">{p.answer}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  {p.products.map(([id, name]) => (
                    <button
                      key={id}
                      onClick={() => navigate('product', { id })}
                      className="text-[13px] font-semibold uppercase tracking-[0.18em] text-amber border-b border-amber/40 hover:border-amber pb-0.5 transition"
                    >
                      {name} →
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
