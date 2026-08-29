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

/** Recognize declared resource fields without accepting inherited object keys. */
function isResourceKey(key: string): key is keyof Resources {
  return RESOURCE_KEYS.has(key)
}

/** Recognize capability fields so their costs never debit the resource group. */
function isCapabilityKey(key: string): key is keyof Capabilities {
  return CAPABILITY_KEYS.has(key)
}

/** Restrict reputation effects to the game's declared reputation fields. */
function isReputationKey(key: string): key is keyof Reputation {
  return REPUTATION_KEYS.has(key)
}

/**
 * Check each cost against its resource or capability balance without mutation.
 * Unknown keys, negative/non-finite costs, and insufficient/non-finite balances
 * return false. An empty cost is affordable.
 */
export function canAffordGameCost(state: Balances, cost: GameAmounts): boolean {
  return Object.entries(cost).every(([key, amount]) => {
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return false
    const current = isResourceKey(key)
      ? state.resources[key]
      : isCapabilityKey(key) ? state.capabilities[key] : undefined
    return typeof current === "number" && Number.isFinite(current) && current >= amount
  })
}

/**
 * Return cloned balance groups with every cost deducted, or null when any cost
 * is invalid or unaffordable. The input remains unchanged on both paths.
 */
export function payGameCost(state: Balances, cost: GameAmounts): Balances | null {
  if (!canAffordGameCost(state, cost)) return null
  const next = { resources: { ...state.resources }, capabilities: { ...state.capabilities } }
  for (const [key, amount] of Object.entries(cost)) {
    if (isResourceKey(key)) next.resources[key] -= amount
    else if (isCapabilityKey(key)) next.capabilities[key] -= amount
  }
  return next
}

/**
 * Pay costs, then add flat resource/capability and nested capability benefits
 * to copies.
 * Return null for an invalid/unaffordable cost, invalid benefit, or non-finite
 * result; no partial payment or reward is ever written to the input state.
 */
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

/**
 * Require a nonempty set of resource conditions to pass strict comparisons.
 * Use a supplied below bound before above; reject unknown resources and missing
 * or non-finite evaluated bounds/balances. Resources are never modified.
 */
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

/**
 * Pay resource-only costs and add resource, reputation, and alignment effects
 * to copies. Return null on invalid/unaffordable costs or non-finite effects
 * and results. Input state and capabilities remain unchanged, including failure.
 */
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
