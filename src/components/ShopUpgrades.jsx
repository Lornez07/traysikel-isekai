import useGameState from '../hooks/useGameState'

function formatNumber(n) {
  return n.toLocaleString()
}

function calcUpgradeCost(currentLevel) {
  return Math.floor(100 * Math.pow(1.65, currentLevel - 1))
}

function UpgradeRow({ label, stationKey, currentLevel, gold, onUpgrade }) {
  const cost = calcUpgradeCost(currentLevel)
  const canAfford = gold >= cost

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-white/80 truncate">{label}</span>
        <span className="text-xs text-white/30">
          Lv.{currentLevel}
          <span className="mx-1.5 text-white/10">→</span>
          Lv.{currentLevel + 1}
        </span>
        <span className="text-xs text-amber-400/60 font-medium">
          {formatNumber(cost)}g
        </span>
      </div>

      <button
        onClick={() => onUpgrade(stationKey, cost)}
        disabled={!canAfford}
        className={`
          relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide
          transition-all duration-300 ease-out min-w-[90px]
          hover:scale-[1.02] active:scale-[0.97]

          ${canAfford
            ? `bg-cyan-400/15 text-cyan-300 border border-cyan-400/30
               shadow-[0_0_12px_rgba(0,240,255,0.15)]
               hover:bg-cyan-400/25 hover:border-cyan-400/50
               hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]`
            : `bg-red-400/5 text-red-400/30 border border-red-400/10
               cursor-not-allowed`
          }
        `}
      >
        {canAfford ? (
          <>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
            UPGRADE
          </>
        ) : (
          'LOCKED'
        )}
      </button>
    </div>
  )
}

export default function ShopUpgrades({ gold }) {
  const { shopStations, upgradeStation } = useGameState()

  const stations = [
    { key: 'counterLevel', label: 'Guild Counter' },
  ]

  return (
    <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto animate-fade-in">
      <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest px-1 pb-1">
        Stations
      </h3>
      {stations.map((s) => (
        <UpgradeRow
          key={s.key}
          label={s.label}
          stationKey={s.key}
          currentLevel={shopStations[s.key]}
          gold={gold}
          onUpgrade={upgradeStation}
        />
      ))}

      <div className="mt-auto pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/15">
          More stations coming soon
        </p>
      </div>
    </div>
  )
}
