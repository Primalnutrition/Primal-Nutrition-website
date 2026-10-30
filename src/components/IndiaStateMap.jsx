/* A tile map of India's 28 states: each state is a labelled tile, laid out
   roughly where it sits on the map. Deliberately no border outline, so there
   is no boundary to get wrong. Tapping a tile shows the full state name. */
import { useState } from 'react'

const TILES = [
  ['PB', 'Punjab', 1, 0], ['HP', 'Himachal Pradesh', 2, 0], ['UK', 'Uttarakhand', 3, 0],
  ['RJ', 'Rajasthan', 0, 1], ['HR', 'Haryana', 1, 1], ['UP', 'Uttar Pradesh', 2, 1], ['BR', 'Bihar', 3, 1], ['SK', 'Sikkim', 5, 1], ['AR', 'Arunachal Pradesh', 6, 1],
  ['GJ', 'Gujarat', 0, 2], ['MP', 'Madhya Pradesh', 2, 2], ['JH', 'Jharkhand', 3, 2], ['WB', 'West Bengal', 4, 2], ['AS', 'Assam', 5, 2], ['NL', 'Nagaland', 6, 2],
  ['MH', 'Maharashtra', 1, 3], ['CG', 'Chhattisgarh', 3, 3], ['OD', 'Odisha', 4, 3], ['ML', 'Meghalaya', 5, 3], ['MN', 'Manipur', 6, 3],
  ['KA', 'Karnataka', 1, 4], ['TS', 'Telangana', 2, 4], ['AP', 'Andhra Pradesh', 3, 4], ['TR', 'Tripura', 5, 4], ['MZ', 'Mizoram', 6, 4],
  ['GA', 'Goa', 0, 5], ['KL', 'Kerala', 1, 5], ['TN', 'Tamil Nadu', 2, 5],
]

export default function IndiaStateMap() {
  const [active, setActive] = useState(null)
  return (
    <div>
      <div role="img" aria-label="Primal is stocked across all 28 states of India" className="grid grid-cols-7 gap-1.5 sm:gap-2 mx-auto max-w-md">
        {TILES.map(([code, name, col, row]) => (
          <button
            key={code}
            type="button"
            title={name}
            onMouseEnter={() => setActive(name)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(name)}
            style={{ gridColumnStart: col + 1, gridRowStart: row + 1 }}
            className={`aspect-square rounded-lg border font-brand text-[11px] sm:text-xs font-bold tracking-wider flex items-center justify-center transition ${
              active === name
                ? 'bg-amber text-ink border-amber scale-105'
                : 'bg-amber/15 text-bone/90 border-amber/35 hover:bg-amber/30'
            }`}
          >
            {code}
          </button>
        ))}
      </div>
      <div className="mt-5 h-8 text-center text-sm text-bone/80 font-brand tracking-widest uppercase">
        {active || 'All 28 states'}
      </div>
    </div>
  )
}
