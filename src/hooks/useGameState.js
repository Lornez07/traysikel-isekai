import { useReducer, useEffect, useCallback, useRef } from 'react'

const GOLD_PER_TICK_BASE = 1
const TICK_INTERVAL_MS = 1000

const INITIAL_STATE = {
  currency: { gold: 500, gems: 10, clout: 0 },
  shopStations: { counterLevel: 1, alchemyBarLevel: 0, unlockedHelpers: 0 },
  activeHeroes: [],
}

function calcPassiveGold(stations) {
  return (
    GOLD_PER_TICK_BASE +
    (stations.counterLevel || 0) * 2 +
    (stations.alchemyBarLevel || 0) * 5 +
    (stations.unlockedHelpers || 0) * 3
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_GOLD':
      return {
        ...state,
        currency: { ...state.currency, gold: state.currency.gold + action.amount },
      }

    case 'SPEND_GOLD': {
      if (state.currency.gold < action.amount) return state
      return {
        ...state,
        currency: { ...state.currency, gold: state.currency.gold - action.amount },
      }
    }

    case 'SPEND_GEMS': {
      if (state.currency.gems < action.amount) return state
      return {
        ...state,
        currency: { ...state.currency, gems: state.currency.gems - action.amount },
      }
    }

    case 'ADD_HERO':
      return {
        ...state,
        activeHeroes: [...state.activeHeroes, action.hero],
      }

    case 'UPGRADE_STATION':
      return {
        ...state,
        shopStations: {
          ...state.shopStations,
          [action.name]: state.shopStations[action.name] + 1,
        },
      }

    case 'PASSIVE_TICK': {
      const earned = calcPassiveGold(state.shopStations)
      return {
        ...state,
        currency: { ...state.currency, gold: state.currency.gold + earned },
      }
    }

    default:
      return state
  }
}

export default function useGameState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'PASSIVE_TICK' })
    }, TICK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const addGold = useCallback((amount) => {
    dispatch({ type: 'ADD_GOLD', amount })
  }, [])

  const spendGold = useCallback((amount) => {
    if (stateRef.current.currency.gold < amount) return false
    dispatch({ type: 'SPEND_GOLD', amount })
    return true
  }, [])

  const spendGems = useCallback((amount) => {
    if (stateRef.current.currency.gems < amount) return false
    dispatch({ type: 'SPEND_GEMS', amount })
    return true
  }, [])

  const addHero = useCallback((hero) => {
    dispatch({ type: 'ADD_HERO', hero })
  }, [])

  const upgradeStation = useCallback((stationName, cost) => {
    if (stateRef.current.currency.gold < cost) return
    dispatch({ type: 'SPEND_GOLD', amount: cost })
    dispatch({ type: 'UPGRADE_STATION', name: stationName })
  }, [])

  return {
    ...state,
    addGold,
    spendGold,
    spendGems,
    addHero,
    upgradeStation,
  }
}
