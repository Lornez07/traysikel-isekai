import { useState } from 'react'
import useGameState from '../hooks/useGameState'
import GuildLobby from './GuildLobby'
import ShopUpgrades from './ShopUpgrades'
import GachaSummon from './GachaSummon'
import ActiveRoster from './ActiveRoster'

const TABS = [
  { key: 'shop', label: 'Shop Upgrades' },
  { key: 'gacha', label: 'Gacha Summon' },
]

const currencyMeta = {
  gold: { icon: '◆', color: 'text-amber-300', glow: 'shadow-amber-400/50' },
  gems: { icon: '✦', color: 'text-cyan-400', glow: 'shadow-cyan-400/50' },
  clout: { icon: '◇', color: 'text-violet-400', glow: 'shadow-violet-400/50' },
}

function formatNumber(n) {
  return n.toLocaleString()
}

function CurrencyBadge({ name, value, meta }) {
  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl
        bg-white/5 backdrop-blur-md border border-white/10
        shadow-lg ${meta.glow} animate-glow-pulse
        transition-transform duration-200 hover:scale-105 active:scale-95
        select-none cursor-default
      `}
    >
      <span className={`text-lg ${meta.color} drop-shadow-[0_0_6px_currentColor]`}>
        {meta.icon}
      </span>
      <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
        {name}
      </span>
      <span className={`text-base font-bold ${meta.color} drop-shadow-[0_0_4px_currentColor]`}>
        {formatNumber(value)}
      </span>
    </div>
  )
}

function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex-1 py-3 px-4 rounded-xl text-sm font-semibold
        tracking-wide transition-all duration-300 ease-out
        hover:scale-[1.02] active:scale-[0.97]
        ${active
          ? 'bg-white/10 text-white shadow-lg border border-white/20'
          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent'
        }
      `}
    >
      {active && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
      )}
      {label}
    </button>
  )
}

function TabContent({ activeTab, gold, gems, onSummon }) {
  if (activeTab === 'shop') {
    return <ShopUpgrades gold={gold} />
  }

  return <GachaSummon gems={gems} onSummon={onSummon} />
}

export default function Dashboard() {
  const { currency, shopStations, activeHeroes, addGold, spendGems, addHero, upgradeStation } = useGameState()
  const [activeTab, setActiveTab] = useState('shop')

  return (
    <div className="min-h-screen bg-midnight text-white overflow-x-hidden">

      {/* ── Fixed Top Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 px-6 flex items-center justify-between
        bg-midnight/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Traysikel
          </span>
          <span className="text-xs font-medium text-white/20 mt-1 hidden sm:inline">
            / Isekai Tycoon
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <CurrencyBadge name="Gold"  value={currency.gold}  meta={currencyMeta.gold} />
          <CurrencyBadge name="Gems"  value={currency.gems}  meta={currencyMeta.gems} />
          <CurrencyBadge name="Clout" value={currency.clout} meta={currencyMeta.clout} />
        </nav>
      </header>

      {/* ── Main Layout ── */}
      <main className="pt-20 p-4 min-h-screen flex gap-4">

        {/* Left Panel — Guild Lobby + Active Roster */}
        <section className="flex-[1.85] rounded-2xl
          bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl
          flex flex-col overflow-hidden animate-fade-in">
          <GuildLobby addGold={addGold} counterLevel={shopStations.counterLevel} />
          <ActiveRoster heroes={activeHeroes} />
        </section>

        {/* Right Panel — Tabbed Sidebar */}
        <section className="flex-1 rounded-2xl
          bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl
          flex flex-col overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.15s' }}>

          {/* Tabs */}
          <div className="flex gap-2 p-3 border-b border-white/10">
            {TABS.map((t) => (
              <TabButton
                key={t.key}
                label={t.label}
                active={activeTab === t.key}
                onClick={() => setActiveTab(t.key)}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex">
            <TabContent
              activeTab={activeTab}
              gold={currency.gold}
              gems={currency.gems}
              onSummon={(hero) => {
                const deducted = spendGems(5)
                if (deducted) addHero(hero)
              }}
            />
          </div>
        </section>

      </main>
    </div>
  )
}
