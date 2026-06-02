import { useState, useCallback, useRef, useEffect } from 'react'
import { rollHero, RARITY_TIERS } from '../data/heroes'

const GEM_COST = 5
const SUMMON_DURATION = 1500

function PortalLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-[spin_2s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border-2 border-violet-400/40 animate-[spin_1.5s_linear_infinite_reverse]" />
        <div className="absolute inset-4 rounded-full border-2 border-cyan-400/50 animate-[spin_1s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-400/20 blur-sm" />
      </div>
      <span className="text-xs font-semibold text-white/40 uppercase tracking-widest animate-pulse-soft">
        Summoning...
      </span>
    </div>
  )
}

function RarityStars({ count }) {
  return (
    <span className="tracking-[0.15em] text-sm">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

export default function GachaSummon({ gems, onSummon }) {
  const [phase, setPhase] = useState('idle')
  const [pulledHero, setPulledHero] = useState(null)
  const [flipState, setFlipState] = useState('back')
  const gemsRef = useRef(gems)
  const onSummonRef = useRef(onSummon)
  gemsRef.current = gems
  onSummonRef.current = onSummon

  const canSummon = gems >= GEM_COST

  const handleSummon = useCallback(() => {
    if (!canSummon) return
    const hero = rollHero()
    setPulledHero(hero)
    onSummonRef.current(hero)
    setPhase('summoning')
    setFlipState('back')

    setTimeout(() => {
      setPhase('reveal')
      requestAnimationFrame(() => setFlipState('front'))
    }, SUMMON_DURATION)
  }, [canSummon])

  const handleClaim = useCallback(() => {
    setPhase('idle')
    setPulledHero(null)
    setFlipState('back')
  }, [])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (phase !== 'idle') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [phase])

  const rarityMeta = pulledHero && (
    pulledHero.stars === 5
      ? { glow: 'shadow-amber-500/60', border: 'border-amber-400/30', bg: 'from-amber-400/10 to-transparent' }
      : pulledHero.stars === 4
        ? { glow: 'shadow-violet-500/60', border: 'border-violet-400/30', bg: 'from-violet-400/10 to-transparent' }
        : { glow: 'shadow-white/10', border: 'border-white/10', bg: 'from-white/[0.04] to-transparent' }
  )

  return (
    <>
      {/* ── Gacha Banner ── */}
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex-1 flex flex-col items-center justify-center p-5 gap-5">
          {/* Banner Frame */}
          <div className="w-full rounded-xl border border-violet-400/20 bg-gradient-to-b from-violet-400/5 to-transparent p-5 text-center shadow-[0_0_24px_rgba(168,85,247,0.08)]">
            <span className="text-3xl block mb-2">🌟</span>
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
              Banner: Fresh Off the Tricycle Rate-Up
            </h3>
            <p className="text-[10px] text-white/30 mt-1 leading-relaxed">
              Rate up on 5★ Legendary Jeepney Drifter!
            </p>
          </div>

          {/* Summon Button */}
          <button
            onClick={handleSummon}
            disabled={!canSummon}
            className={`
              relative w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase
              transition-all duration-300 ease-out
              hover:scale-[1.02] active:scale-[0.97]

              ${canSummon
                ? `bg-violet-500/20 text-violet-200 border border-violet-400/30
                   shadow-[0_0_20px_rgba(168,85,247,0.2)]
                   hover:bg-violet-500/30 hover:border-violet-400/50
                   hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]
                   cursor-pointer`
                : `bg-white/[0.02] text-white/15 border border-white/5
                   cursor-not-allowed`
              }
            `}
          >
            {canSummon ? (
              <>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
                Summon Hero (Cost: {GEM_COST} Gems)
              </>
            ) : (
              `Not enough gems (${GEM_COST} required)`
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 text-center border-t border-white/5">
          <p className="text-[9px] text-white/15">
            {RARITY_TIERS.map((t) => `${t.label} ${t.stars}★ ${t.weight}%`).join('  ·  ')}
          </p>
        </div>
      </div>

      {/* ── Full-Screen Reveal Modal ── */}
      {phase !== 'idle' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center
          bg-midnight/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xs mx-auto">
            {phase === 'summoning' && <PortalLoading />}

            {phase === 'reveal' && pulledHero && (
              <div className="flex flex-col items-center gap-5 animate-fade-in">
                {/* Card Flip Container */}
                <div
                  className={`
                    relative w-64 rounded-2xl p-6 text-center
                    bg-gradient-to-b ${rarityMeta.bg} from-10% to-midnight
                    border ${rarityMeta.border}
                    shadow-xl ${rarityMeta.glow}
                    transition-all duration-500 [backface-visibility:hidden]
                    ${flipState === 'back'
                      ? '[transform:rotateY(180deg)] opacity-0'
                      : '[transform:rotateY(0deg)] opacity-100'
                    }
                    [transform-style:preserve-3d]
                  `}
                >
                  {/* Rarity glow overlay */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${rarityMeta.bg} opacity-40 pointer-events-none`} />

                  {/* Emoji */}
                  <span className="text-5xl block mb-3 relative">
                    {pulledHero.emoji}
                  </span>

                  {/* Stars */}
                  <div className={`mb-2 ${pulledHero.stars === 5 ? 'text-amber-400' : pulledHero.stars === 4 ? 'text-violet-400' : 'text-white/40'}`}>
                    <RarityStars count={pulledHero.stars} />
                  </div>

                  {/* Rarity label */}
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em]
                    ${pulledHero.stars === 5 ? 'text-amber-400/70' : pulledHero.stars === 4 ? 'text-violet-400/70' : 'text-white/30'}`}>
                    {pulledHero.stars}★{' '}
                    {RARITY_TIERS.find((t) => t.stars === pulledHero.stars)?.label}
                  </span>

                  {/* Name */}
                  <h4 className="text-base font-bold text-white/80 mt-2 leading-tight">
                    {pulledHero.name}
                  </h4>

                  {/* Tagline */}
                  <p className="text-[11px] text-white/40 italic mt-2 leading-relaxed">
                    &ldquo;{pulledHero.tagline}&rdquo;
                  </p>

                  {/* 5★ extra glow */}
                  {pulledHero.stars === 5 && (
                    <div className="absolute -inset-4 rounded-3xl border border-amber-400/20 opacity-60 pointer-events-none animate-glow-pulse" />
                  )}
                </div>

                {/* Claim Button */}
                <button
                  onClick={handleClaim}
                  className={`
                    px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase
                    transition-all duration-300 ease-out
                    hover:scale-105 active:scale-95
                    ${pulledHero.stars === 5
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                      : pulledHero.stars === 4
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-400/30 shadow-[0_0_16px_rgba(168,85,247,0.2)]'
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }
                  `}
                >
                  Claim Hero
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
