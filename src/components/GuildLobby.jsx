import { useState, useEffect, useRef, useCallback } from 'react'
import { CUSTOMER_TITLES, CUSTOMER_DIALOGUES } from '../data/customers'

const MIN_SPAWN_DELAY = 4000
const MAX_SPAWN_DELAY = 6000
const ENTER_DURATION = 400
const WAIT_DURATION = 3000
const LEAVE_DURATION = 400
const FLOATER_LIFETIME = 1500

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function CustomerCard({ customer }) {
  return (
    <div
      className={`
        w-full max-w-sm rounded-xl p-4
        bg-white/5 backdrop-blur-md border border-white/10
        shadow-lg shadow-black/20
        transition-all duration-[400ms] ease-out

        ${customer.state === 'entering'
          ? 'opacity-0 translate-x-[-30px]'
          : 'opacity-100 translate-x-0'
        }
        ${customer.state === 'leaving'
          ? 'opacity-0 translate-x-[30px]'
          : ''
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-400/30 flex items-center justify-center text-[10px]">
          {customer.emoji}
        </span>
        <span className="text-xs font-semibold text-white/70 truncate">
          {customer.title}
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="relative ml-3 mb-3 bg-white/[0.06] rounded-lg px-3 py-2 border border-white/5">
        <div className="absolute -left-1.5 top-3 w-2.5 h-2.5 bg-white/[0.06] border-l border-b border-white/5 rotate-45" />
        <p className="text-[11px] text-white/50 italic leading-relaxed">
          &ldquo;{customer.dialogue}&rdquo;
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400
            ${customer.state === 'waiting' ? 'animate-progress' : ''}
            ${customer.state === 'leaving' ? 'w-full' : ''}
            ${customer.state === 'entering' ? 'w-0' : ''}
          `}
        />
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-white/20">
        <span>
          {customer.state === 'entering' && 'Arriving...'}
          {customer.state === 'waiting' && 'Processing...'}
          {customer.state === 'leaving' && 'Complete!'}
        </span>
        <span>+{customer.earnings}g</span>
      </div>
    </div>
  )
}

function FloatText({ text, style }) {
  return (
    <span
      className="absolute text-lg font-bold text-green-400 pointer-events-none drop-shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-float-up"
      style={style}
    >
      {text}
    </span>
  )
}

export default function GuildLobby({ addGold, counterLevel }) {
  const [customers, setCustomers] = useState([])
  const [floaters, setFloaters] = useState([])
  const nextIdRef = useRef(0)
  const addGoldRef = useRef(addGold)
  const counterRef = useRef(counterLevel)

  addGoldRef.current = addGold
  counterRef.current = counterLevel

  const spawnCustomer = useCallback(() => {
    const id = nextIdRef.current++
    const title = pickRandom(CUSTOMER_TITLES)
    const dialogue = pickRandom(CUSTOMER_DIALOGUES)
    const earnings = 15 * counterRef.current
    const emoji = pickRandom(['🧙', '🧝', '⚔️', '🔮', '🧪', '🎭', '🗡️', '🛡️', '📜', '🏹'])

    setCustomers((prev) => [...prev, { id, title, dialogue, earnings, emoji, state: 'entering' }])

    // entering → waiting
    setTimeout(() => {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, state: 'waiting' } : c)))
    }, ENTER_DURATION)

    // waiting → leaving
    setTimeout(() => {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, state: 'leaving' } : c)))
    }, ENTER_DURATION + WAIT_DURATION)

    // leaving → remove + reward
    setTimeout(() => {
      addGoldRef.current(earnings)
      setFloaters((prev) => [...prev, { id: `f-${id}`, text: `+${earnings}g` }])
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    }, ENTER_DURATION + WAIT_DURATION + LEAVE_DURATION)
  }, [])

  // Spawn loop
  useEffect(() => {
    let timer

    function schedule() {
      const delay = MIN_SPAWN_DELAY + Math.random() * (MAX_SPAWN_DELAY - MIN_SPAWN_DELAY)
      timer = setTimeout(() => {
        spawnCustomer()
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timer)
  }, [spawnCustomer])

  // Cleanup expired floaters
  useEffect(() => {
    if (floaters.length === 0) return
    const latest = floaters[floaters.length - 1]
    const timer = setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== latest.id))
    }, FLOATER_LIFETIME)
    return () => clearTimeout(timer)
  }, [floaters])

  return (
    <div className="relative flex-1 flex flex-col items-center justify-end p-6 overflow-hidden">
      {/* Floating gold texts */}
      {floaters.map((f, i) => (
        <FloatText
          key={f.id}
          text={f.text}
          style={{
            bottom: `${40 + i * 8}%`,
            left: `${45 + (i % 3 === 1 ? 10 : i % 3 === 2 ? -10 : 0)}%`,
          }}
        />
      ))}

      {/* Customer list stacked upward */}
      <div className="flex flex-col-reverse gap-3 w-full items-center">
        {customers.map((c) => (
          <CustomerCard key={c.id} customer={c} />
        ))}
      </div>

      {/* Empty state hint */}
      {customers.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-5xl mb-3 opacity-20">🏛️</span>
          <p className="text-white/15 text-xs animate-pulse">
            Waiting for customers...
          </p>
        </div>
      )}
    </div>
  )
}
