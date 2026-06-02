function RosterBadge({ hero }) {
  const borderColor =
    hero.stars === 5
      ? 'border-amber-400/30'
      : hero.stars === 4
        ? 'border-violet-400/30'
        : 'border-white/10'

  return (
    <div
      className={`
        flex items-center gap-2 px-2.5 py-1.5 rounded-lg
        bg-white/[0.04] border ${borderColor}
        transition-all duration-200 hover:scale-105 hover:bg-white/[0.07]
        cursor-default
      `}
      title={hero.tagline}
    >
      <span className="text-sm">{hero.emoji}</span>
      <span className="text-[10px] font-medium text-white/60 truncate max-w-[100px]">
        {hero.name}
      </span>
      <span className={`text-[9px] ${hero.stars >= 5 ? 'text-amber-400/70' : hero.stars >= 4 ? 'text-violet-400/70' : 'text-white/30'}`}>
        {hero.stars}★
      </span>
    </div>
  )
}

export default function ActiveRoster({ heroes }) {
  if (heroes.length === 0) return null

  return (
    <div className="w-full border-t border-white/5 px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Active Party
        </span>
        <span className="text-[10px] text-white/15">
          ({heroes.length} hero{heroes.length !== 1 ? 'es' : ''})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {heroes.map((h) => (
          <RosterBadge key={h.id} hero={h} />
        ))}
      </div>
    </div>
  )
}
