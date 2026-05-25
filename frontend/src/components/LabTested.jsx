/* Mock Certificate of Analysis for T-Rex. Independent third-party lab —
   no specific lab brand mentioned (per directive 6.1).
   COA table reflects the ACTUAL 7-ingredient formula on the bottle.    */
export default function LabTested() {
  return (
    <section id="labs" className="py-28 bg-gradient-to-b from-ink-800/60 to-ink relative">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Mock report */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-amber/10 blur-3xl rounded-3xl" />
              <div className="relative rounded-2xl bg-bone text-ink p-8 shadow-2xl rotate-[-1.5deg] hover:rotate-0 transition-transform duration-700">
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-ink/10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-ink/50 font-brand">Certificate of Analysis</div>
                    <div className="font-display text-2xl tracking-tight uppercase">T-REX · BATCH #TR-2410</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-ink/50 font-brand">Tested by</div>
                    <div className="font-bold text-sm font-brand">3RD-PARTY LAB</div>
                    <div className="text-[10px] text-ink/50">Mfg. Lic. AL946M</div>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-ink/50 border-b border-ink/10">
                      <th className="text-left py-2">Compound</th>
                      <th className="text-right py-2">Declared</th>
                      <th className="text-right py-2">Tested</th>
                      <th className="text-right py-2">Result</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium">
                    {labRows.map((r) => (
                      <tr key={r.compound} className="border-b border-ink/5">
                        <td className="py-2.5">{r.compound}</td>
                        <td className="text-right text-ink/70">{r.declared}</td>
                        <td className="text-right text-ink/70">{r.tested}</td>
                        <td className="text-right font-semibold text-forest">✓ {r.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-5 pt-4 border-t border-ink/10 grid grid-cols-3 gap-3 text-center">
                  <Pill label="Heavy metals" value="< LOQ" />
                  <Pill label="Microbial" value="Pass" />
                  <Pill label="Pesticides" value="Not detected" />
                </div>

                <div className="mt-5 flex items-center justify-between text-[10px] text-ink/40 font-brand">
                  <span>Tested: 14 Oct 2025</span>
                  <span>Ayurvedic Proprietary Medicine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6">
            <div className="eyebrow mb-5 font-brand tracking-[0.28em]">Lab Tested · Every Batch</div>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-6 uppercase">
              WE DON'T ASK YOU<br/>
              TO TRUST US.<br/>
              <span className="text-shimmer">WE HAND YOU THE PROOF.</span>
            </h2>
            <p className="text-lg text-bone/70 mb-8 leading-relaxed">
              Every batch of T-Rex is tested by an <strong className="text-bone">independent third-party lab</strong>. Heavy metals, microbial contamination, pesticide residues, label-claim verification. Manufacturing licensed under <span className="text-amber font-semibold">AL946M</span> — an Ayurvedic Proprietary Medicine.
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
            <a href="#" className="btn-ghost">View certifications →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

const labRows = [
  { compound: 'Himalayan Shilajit (Fulvic acid)', declared: '50 mg', tested: '52 mg', result: 'Pass' },
  { compound: 'Ashwagandha (Withanolides)', declared: '100 mg', tested: '104 mg', result: 'Pass' },
  { compound: 'Arjun Chal (Terminalia)', declared: '100 mg', tested: '101 mg', result: 'Pass' },
  { compound: 'Gokhru (Tribulus saponins)', declared: '50 mg', tested: '51 mg', result: 'Pass' },
  { compound: 'Safed Musli (Chlorophytum)', declared: '100 mg', tested: '103 mg', result: 'Pass' },
]

const checks = [
  'Heavy metals (As, Pb, Hg, Cd) tested per batch',
  'Microbial load (yeast, mold, E. coli, salmonella)',
  'Pesticide residue scan',
  'Active compound % verified vs. label claim',
  'FSSAI licensed · Ayush certified · Dope-free declared',
]

function Pill({ label, value }) {
  return (
    <div className="border border-forest/30 rounded-md p-2 bg-forest/5">
      <div className="text-[9px] uppercase tracking-widest text-ink/50 font-brand">{label}</div>
      <div className="font-display font-bold text-forest text-sm">{value}</div>
    </div>
  )
}
