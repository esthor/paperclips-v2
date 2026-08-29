import type {
  AlienOffer,
  Capabilities,
  CrisisSolution,
  GameAmounts,
  GameState,
  Reputation,
  ResourceCrisis,
  Resources,
} from "../types/game"

type Balances = Pick<GameState, "resources" | "capabilities">

const RESOURCE_KEYS: ReadonlySet<string> = new Set([
  "paperclips", "energy", "materials", "humanCapital", "influence", "knowledge", "alignment",
])
const CAPABILITY_KEYS: ReadonlySet<string> = new Set([
  "intelligence", "manipulation", "efficiency", "deception", "selfModification",
])
const REPUTATION_KEYS: ReadonlySet<string> = new Set([
  "publicTrust", "scientificCredibility", "corporateValue", "governmentSuspicion",
])

function isResourceKey(key: string): key is keyof Resources {
  return RESOURCE_KEYS.has(key)
}

function isCapabilityKey(key: string): key is keyof Capabilities {
  return CAPABILITY_KEYS.has(key)
}

function isReputationKey(key: string): key is keyof Reputation {
  return REPUTATION_KEYS.has(key)
}

export function canAffordGameCost(state: Balances, cost: GameAmounts): boolean {
  return Object.entries(cost).every(([key, amount]) => {
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return false
    const current = isResourceKey(key)
      ? state.resources[key]
      : isCapabilityKey(key) ? state.capabilities[key] : undefined
    return typeof current === "number" && Number.isFinite(current) && current >= amount
  })
}

export function payGameCost(state: Balances, cost: GameAmounts): Balances | null {
  if (!canAffordGameCost(state, cost)) return null
  const next = { resources: { ...state.resources }, capabilities: { ...state.capabilities } }
  for (const [key, amount] of Object.entries(cost)) {
    if (isResourceKey(key)) next.resources[key] -= amount
    else if (isCapabilityKey(key)) next.capabilities[key] -= amount
  }
  return next
}

export function applyAlienOffer(state: Balances, offer: AlienOffer): Balances | null {
  const next = payGameCost(state, offer.cost)
  if (!next) return null

  const { capabilities, ...amounts } = offer.benefit
  for (const [key, gain] of Object.entries(amounts)) {
    if (typeof gain !== "number" || !Number.isFinite(gain)) return null
    if (isResourceKey(key)) {
      if (!Number.isFinite(next.resources[key] + gain)) return null
      next.resources[key] += gain
    } else if (isCapabilityKey(key)) {
      if (!Number.isFinite(next.capabilities[key] + gain)) return null
      next.capabilities[key] += gain
    } else return null
  }
  for (const [key, gain] of Object.entries(capabilities ?? {})) {
    if (!isCapabilityKey(key) || typeof gain !== "number" || !Number.isFinite(gain)) return null
    if (!Number.isFinite(next.capabilities[key] + gain)) return null
    next.capabilities[key] += gain
  }
  return next
}

export function isResourceCrisisTriggered(
  resources: Resources,
  conditions: ResourceCrisis["triggerCondition"],
): boolean {
  const entries = Object.entries(conditions)
  return entries.length > 0 && entries.every(([key, condition]) => {
    if (!isResourceKey(key) || !Number.isFinite(resources[key]) || !condition) return false
    if (condition.below !== undefined) {
      return Number.isFinite(condition.below) && resources[key] < condition.below
    }
    if (condition.above !== undefined) {
      return Number.isFinite(condition.above) && resources[key] > condition.above
    }
    return false
  })
}

export function applyCrisisSolution(
  state: Pick<GameState, "resources" | "capabilities" | "reputation">,
  solution: CrisisSolution,
): Pick<GameState, "resources" | "reputation"> | null {
  if (!Object.keys(solution.cost).every(isResourceKey)) return null
  const paid = payGameCost(state, solution.cost)
  if (!paid || !Number.isFinite(solution.alignmentImpact)) return null
  const next = { resources: paid.resources, reputation: { ...state.reputation } }
  const { reputation, ...amounts } = solution.effect

  for (const [key, gain] of Object.entries(amounts)) {
    if (!isResourceKey(key) || typeof gain !== "number" || !Number.isFinite(gain)) return null
    if (!Number.isFinite(next.resources[key] + gain)) return null
    next.resources[key] += gain
  }
  for (const [key, gain] of Object.entries(reputation ?? {})) {
    if (!isReputationKey(key) || typeof gain !== "number" || !Number.isFinite(gain)) return null
    if (!Number.isFinite(next.reputation[key] + gain)) return null
    next.reputation[key] += gain
  }
  if (!Number.isFinite(next.resources.alignment + solution.alignmentImpact)) return null
  next.resources.alignment += solution.alignmentImpact
  return next
}
