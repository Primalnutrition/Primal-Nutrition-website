/* Lab-testing section. No invented certificate numbers: shows what we test, not made-up results. */
export default function LabTested() {
  return (
    <section id="labs" className="py-28 bg-gradient-to-b from-ink-800/60 to-ink relative">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-8 lg:col-start-3">
            <div className="eyebrow mb-5 font-brand tracking-[0.28em]">Lab Tested · Every Batch</div>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-6 uppercase">
              WE DON'T ASK YOU<br/>
              TO TRUST US.<br/>
              <span className="text-shimmer">WE HAND YOU THE PROOF.</span>
            </h2>
            <p className="text-lg text-bone/70 mb-8 leading-relaxed">
              Every batch of Primal Nutrition is tested by an <strong className="text-bone">independent third-party lab</strong>. Heavy metals, microbial contamination, pesticide residues, label-claim verification. Manufacturing licensed under <span className="text-amber font-semibold">AL946M</span> — an Ayurvedic Proprietary Medicine.
            </p>
            <ul className="space-y-3 mb-8">
              {checks.map((c) => (
                <li key={c} className="flex items-start gap-3 text-bone/85">
                  <span className="w-5 h-5 rounded-full bg-amber/20 border border-amber/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-amber" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <a href="#/product-info/trex-liquid" className="btn-ghost">View certifications →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

const checks = [
  'Heavy metals (As, Pb, Hg, Cd) tested per batch',
  'Microbial load (yeast, mold, E. coli, salmonella)',
  'Pesticide residue scan',
  'Active compound % verified vs. label claim',
  'Made by a licensed Ayurvedic manufacturer (Mfg. Lic. AL946M)',
]

