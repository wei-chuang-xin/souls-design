// Client-safe utilities (no fs/path)
export const TYPE_COLORS: Record<string, string> = {
  soul: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  skill: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  prompt: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  team: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

export const AVATAR_COLORS: Record<string, string> = {
  soul: 'from-violet-600 to-purple-700',
  skill: 'from-blue-600 to-cyan-700',
  prompt: 'from-emerald-600 to-teal-700',
  team: 'from-orange-600 to-amber-700',
}
