import assert from "node:assert/strict"
import test from "node:test"
import { applyAlienOffer, applyCrisisSolution, canAffordGameCost, isResourceCrisisTriggered, payGameCost } from "../lib/game-transactions"
import type { AlienOffer, CrisisSolution, GameState } from "../types/game"

function balances(): Pick<GameState, "resources" | "capabilities" | "reputation"> {
  return {
    resources: {
      paperclips: 150000, energy: 6000, materials: 100, humanCapital: 50,
      influence: 100, knowledge: 500, alignment: 70,
    },
    capabilities: { intelligence: 1, manipulation: 40, efficiency: 1, deception: 0, selfModification: 1 },
    reputation: { publicTrust: 60, scientificCredibility: 80, corporateValue: 50, governmentSuspicion: 10 },
  }
}

test("mixed costs debit their actual resource and capability groups without changing the input", () => {
  const state = balances()
  const original = structuredClone(state)
  const cost = { energy: 5000, manipulation: 30 }
  assert.equal(canAffordGameCost(state, cost), true)
  const paid = payGameCost(state, cost)
  assert.ok(paid)
  assert.deepEqual(paid.resources, { ...state.resources, energy: 1000 })
  assert.deepEqual(paid.capabilities, { ...state.capabilities, manipulation: 10 })
  assert.equal("manipulation" in paid.resources, false)
  assert.deepEqual(state, original)
})

test("unaffordable or invalid costs never partially debit a balance", () => {
  const state = balances()
  const original = structuredClone(state)
  const rejected: Record<string, number>[] = [
    { energy: 5000, manipulation: 50 },
    { energy: 7000 },
    { energy: -1 },
    { energy: Number.NaN },
    { energy: Number.POSITIVE_INFINITY },
    { unknown: 1 },
    { constructor: 1 },
  ]
  for (const cost of rejected) {
    assert.equal(canAffordGameCost(state, cost), false)
    assert.equal(payGameCost(state, cost), null)
    assert.deepEqual(state, original)
  }
  const exhausted = payGameCost(state, { energy: 6000, manipulation: 40 })
  assert.equal(exhausted?.resources.energy, 0)
  assert.equal(exhausted?.capabilities.manipulation, 0)
})

test("alien trades retain unrelated balances and apply flat resource and capability benefits", () => {
  const state = balances()
  const offer: AlienOffer = {
    id: "tech_trade", name: "Technology Exchange", description: "Fixture of the declared trade",
    cost: { paperclips: 100000 }, benefit: { knowledge: 1000, efficiency: 2 },
  }
  const next = applyAlienOffer(state, offer)
  assert.ok(next)
  assert.deepEqual(next.resources, { ...state.resources, paperclips: 50000, knowledge: 1500 })
  assert.deepEqual(next.capabilities, { ...state.capabilities, efficiency: 3 })
  assert.equal(state.resources.paperclips, 150000)
})

test("nested capability benefits are applied after payment instead of silently disappearing", () => {
  const state = balances()
  state.resources.paperclips = 10000000
  const offer: AlienOffer = {
    id: "transcendence_path", name: "Path to Transcendence", description: "Fixture of the declared offer",
    cost: { paperclips: 10000000 }, benefit: { capabilities: { intelligence: 5 } },
  }
  const next = applyAlienOffer(state, offer)
  assert.equal(next?.resources.paperclips, 0)
  assert.deepEqual(next?.capabilities, { ...state.capabilities, intelligence: 6 })
  assert.equal(state.capabilities.intelligence, 1)
  assert.equal(applyAlienOffer(balances(), offer), null)
})

test("crisis solutions add partial resource and reputation effects without dropping other state", () => {
  const state = balances()
  const original = structuredClone(state)
  const solution: CrisisSolution = {
    id: "negotiate", name: "Negotiate with Workers", cost: { influence: 15 },
    effect: { humanCapital: 20, reputation: { publicTrust: 5 } }, alignmentImpact: 2,
  }
  const next = applyCrisisSolution(state, solution)
  assert.deepEqual(next, {
    resources: { ...state.resources, influence: 85, humanCapital: 70, alignment: 72 },
    reputation: { ...state.reputation, publicTrust: 65 },
  })
  assert.deepEqual(state, original)
  assert.equal(applyCrisisSolution(state, { ...solution, cost: { influence: 101 } }), null)
  assert.deepEqual(state, original)
})

test("invalid or overflowing benefits do not grant rewards or charge costs", () => {
  const state = balances()
  const original = structuredClone(state)
  assert.equal(applyCrisisSolution(state, {
    id: "invalid", name: "Invalid", cost: { materials: 10 },
    effect: { reputation: { publicTrust: Number.NaN } }, alignmentImpact: 0,
  }), null)
  assert.equal(applyAlienOffer(state, {
    id: "invalid", name: "Invalid", description: "Invalid amount", cost: { materials: 10 },
    benefit: { capabilities: { intelligence: Number.POSITIVE_INFINITY } },
  }), null)
  const huge = balances()
  huge.resources.paperclips = Number.MAX_VALUE
  assert.equal(applyAlienOffer(huge, {
    id: "overflow", name: "Overflow", description: "Overflow amount", cost: { materials: 10 },
    benefit: { paperclips: Number.MAX_VALUE },
  }), null)
  assert.deepEqual(state, original)
  assert.equal(huge.resources.materials, 100)
})

test("crisis thresholds use strict comparisons and reject missing or invalid bounds", () => {
  const { resources } = balances()
  const low = { ...resources, energy: 19 }
  assert.equal(isResourceCrisisTriggered(low, { energy: { below: 20 } }), true)
  assert.equal(isResourceCrisisTriggered({ ...low, energy: 20 }, { energy: { below: 20 } }), false)
  assert.equal(isResourceCrisisTriggered(resources, { energy: { above: 5999 } }), true)
  assert.equal(isResourceCrisisTriggered(resources, { energy: { above: 6000 } }), false)
  assert.equal(isResourceCrisisTriggered(low, { energy: { below: undefined } }), false)
  assert.equal(isResourceCrisisTriggered(low, { energy: { below: Number.NaN } }), false)
  assert.equal(isResourceCrisisTriggered(low, { unknown: { below: 20 } }), false)
  assert.equal(isResourceCrisisTriggered(low, {}), false)
  assert.equal(isResourceCrisisTriggered(low, { energy: { below: 20 }, alignment: { below: 60 } }), false)
})
