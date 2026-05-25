export default function Comparison() {
  const rows = [
    ['Format', 'Liquid · sublingual', 'Capsules', 'Capsules'],
    ['Absorption', 'Fully bioavailable', 'Standard', 'Standard'],
    ['Servings / bottle', '50 (10ml) / 16 (15ml)', '60', '30'],
    ['Active ingredients', '7-in-1 (Shilajit + 6 herbs)', '17-herb proprietary blend', '6 ingredients'],
    ['Dose disclosure', 'Every herb in mg', 'Proprietary blend', 'Some disclosed'],
    ['3rd-party tested', 'Third-party, every batch', 'Not published', 'Not published'],
    ['Standardized %', 'All actives', 'Not specified', 'Partial'],
    ['Source transparency', 'Origin disclosed', 'Generic India', 'Generic US'],
    ['Cost / day', '₹40', '₹13', '$0.97 (~₹80)'],
    ['Cost / clinically dosed mg', 'Lowest', 'Cannot calculate', 'Mid'],
  ]
  return (
    <section className="py-28 relative">
      <div className="container-x">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5">vs. The Category</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-5">
            We don't fear the comparison.<br/>
            <span className="italic font-medium text-amber-light">We invite it.</span>
          </h2>
          <p className="text-bone/65 text-lg">
            Look at any other testosterone supplement on the Indian market. Then look at ours. Then look at the lab reports. Then decide.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-bone/10 bg-ink-800/40">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-bone/10">
                <th className="text-left p-5 text-[11px] uppercase tracking-widest text-bone/40 font-medium"></th>
                <th className="p-5 text-left bg-amber/10 relative">
                  <div className="absolute -top-3 left-5 px-2 py-0.5 rounded-full bg-amber text-ink text-[9px] uppercase tracking-widest font-bold">Best for men</div>
                  <div className="font-display font-bold text-xl text-amber">Primal T-Rex</div>
                  <div className="text-xs text-bone/60 mt-1">₹1,999 · 500ml</div>
                </th>
                <th className="p-5 text-left">
                  <div className="font-display font-semibold text-lg text-bone/70">Kapiva Testo Boost</div>
                  <div className="text-xs text-bone/40 mt-1">₹799 · 60 caps</div>
                </th>
                <th className="p-5 text-left">
                  <div className="font-display font-semibold text-lg text-bone/70">Roman Testosterone</div>
                  <div className="text-xs text-bone/40 mt-1">$29 · 120 tabs</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row[0]} className={`border-b border-bone/5 ${i % 2 === 0 ? 'bg-ink/30' : ''}`}>
                  <td className="p-4 px-5 text-bone/50 text-sm font-medium">{row[0]}</td>
                  <td className="p-4 px-5 bg-amber/5 text-bone font-medium text-[15px]">{row[1]}</td>
                  <td className="p-4 px-5 text-bone/60 text-sm">{row[2]}</td>
                  <td className="p-4 px-5 text-bone/60 text-sm">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-bone/40 text-xs mt-4 text-center">
          Sources: Primal Nutrition COA (Third-Party Lab), Kapiva Himfoods listing, Roman Pharmacy Roman Testosterone Support label. Last verified May 2026.
        </p>
      </div>
    </section>
  )
}
