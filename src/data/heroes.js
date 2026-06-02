export const RARITY_TIERS = [
  { stars: 3, label: 'Common',  weight: 70, color: 'text-white/70', glow: '' },
  { stars: 4, label: 'Rare',    weight: 25, color: 'text-violet-300', glow: 'shadow-violet-500/50' },
  { stars: 5, label: 'Ultra Rare', weight: 5, color: 'text-amber-300', glow: 'shadow-amber-500/50' },
]

export const HEROES = [
  // ── 3-Star ──
  {
    name: 'Over-caffeinated IT Student',
    stars: 3,
    tagline: '23 cups of kopiko and still debugging.',
    emoji: '💻',
  },
  {
    name: 'Late-for-Class Archer',
    stars: 3,
    tagline: 'Always arrives after the boss fight.',
    emoji: '🏹',
  },
  {
    name: 'Thesis Group Member (Pabuhat Class)',
    stars: 3,
    tagline: 'Contribution: "Thank you" sa acknowledgments.',
    emoji: '📄',
  },
  {
    name: 'Tambay sa Kantina Swordsman',
    stars: 3,
    tagline: 'His blade? Rusty. His chismis? Fresh.',
    emoji: '🗡️',
  },
  {
    name: 'Naligo sa Enchanted River Intern',
    stars: 3,
    tagline: 'Now has underwater breathing. And fungus.',
    emoji: '🧜',
  },
  // ── 4-Star ──
  {
    name: "Dean's Lister Paladin",
    stars: 4,
    tagline: 'Shields party with 2-inch thick course syllabus.',
    emoji: '🛡️',
  },
  {
    name: 'Varsity Slasher',
    stars: 4,
    tagline: 'UAAP champion. Also chops goblins.',
    emoji: '⚔️',
  },
  {
    name: 'Crypto-Trading Alchemist',
    stars: 4,
    tagline: 'Turned lead to NFT. Then rug-pulled the demon lord.',
    emoji: '🧪',
  },
  {
    name: 'Scholarship Grinder Mage',
    stars: 4,
    tagline: 'Spams fireballs like extension deadlines.',
    emoji: '🔥',
  },
  // ── 5-Star ──
  {
    name: 'Summa Cum Laude Chronomancer',
    stars: 5,
    tagline: 'Stopped time to finish all his reqs. And the war.',
    emoji: '⏳',
  },
  {
    name: 'Legendary Jeepney Drifter',
    stars: 5,
    tagline: 'Routes through alternate dimensions. Beep beep.',
    emoji: '🚍',
  },
  {
    name: 'The Ultimate Thesis Leader (Carrying the Guild)',
    stars: 5,
    tagline: 'Did 95% of the work. Still won\'t let the group forget.',
    emoji: '👑',
  },
]

export function rollHero() {
  const roll = Math.random() * 100
  let cumulative = 0

  for (const tier of RARITY_TIERS) {
    cumulative += tier.weight
    if (roll < cumulative) {
      const pool = HEROES.filter((h) => h.stars === tier.stars)
      const hero = { ...pool[Math.floor(Math.random() * pool.length)], id: crypto.randomUUID() }
      return hero
    }
  }

  const fallback = HEROES.filter((h) => h.stars === 3)
  return { ...fallback[0], id: crypto.randomUUID() }
}
