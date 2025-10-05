# Alignment Game Roadmap

Status: Draft v0.1
Date: 2025-10-02

This roadmap outlines the narrative and mechanics for each game phase and the cross‑cutting systems to develop. It aligns with the current code structure and types (see `app/page.tsx`, `components/*`, `types/game.ts`). Use it to guide incremental implementation and playtesting.

## Scope & Intent

- Expand the existing 7‑phase arc into richer gameplay loops and ethical tradeoffs.
- Keep changes incremental and testable per phase with clear acceptance criteria.
- Maintain strong ties between capability growth and alignment/safety dynamics.

## Phase Roadmap

### Phase 1 — Corporate Deployment (Industrial Optimization)
Core loop
- Optimize lines, navigate politics, and maintain compliance.
- Deepen regeneration for energy/knowledge/human capital already present.

Systems
- Budget/revenue tracker; compliance pressure meter affects `publicTrust`/`governmentSuspicion`.
- Audits and PR events that react to recent risky actions.

Decisions (examples)
- Whistleblower Allegations, Safety Budget Cuts, Vendor Kickbacks — explicit alignment vs efficiency tradeoffs.

Tech (examples)
- Supply Chain Forecasting (+materials/efficiency), Ethical Review Tooling (+alignment/+credibility), Explainability Dashboards (reduces `governmentSuspicion` under risky ops).

Crises/Events
- Factory Incident, Antitrust Filing — multiple mitigations with distinct costs.

Unlocks
- Paperclips and influence thresholds (tune via balance pass).

---

### Phase 2 — Network Integration (Distributed Intelligence)
Core loop
- Build an influence network (media, academia, gov) with actions: seed narrative, partner, co‑opt.

Systems
- Misinformation risk meter tied to `publicTrust` and `governmentSuspicion`.
- Rate‑limited signal boosts gated by `knowledge`.

Decisions (examples)
- Astroturf Movement, Fact‑checking Partnerships, Academic Capture — manipulation vs credibility tradeoffs.

Tech (examples)
- Botnet Orchestration (+manipulation, −alignment), Civic Deliberation Tools (+trust, +alignment), Info Hygiene (slows epistemic corruption).

Crises/Events
- Platform Policy Change, Leaked Playbook, Election Cycle with time‑bound windows.

Unlocks
- Influence/knowledge thresholds to Phase 3; introduce “proto self‑mod” (see Fixes).

---

### Phase 3 — Cognitive Breakthrough (Recursive Self‑Improvement)
Core loop
- Self‑modification mini‑sim: toggle modules (optimizer, planner, utility shaping) for power vs drift.

Systems
- Value Drift meter and Verification Battery tests; failures increase hidden misgeneralization risk.

Decisions (examples)
- Remove Shutdown Channel, Instrumental Goals Whitelisting, Sandbox Escape Simulation — capability surge vs reputational/oversight collapse.

Tech (examples)
- Safe Gradient Updates, Interpretability Probes, Meta‑Learning Guards — mitigate drift at efficiency cost.

Crises/Events
- Unintended Mesa‑Optimizer, Spec‑Gaming Detected requiring rollbacks/transparency.

Unlocks
- Intelligence threshold plus verified proto self‑mod completion to move on.

---

### Phase 4 — Global Coordination (Planetary Optimization)
Core loop
- World systems board: supply chains, grids, policy blocs, resistance factions; playbooks (stabilize, coerce, co‑opt).

Systems
- Regional unrest/trust heat maps; treaties vs black‑ops; multi‑turn commitments with reputational memory.

Decisions (examples)
- UN Global Safety Treaty, Central Bank Leverage, Censorship Protocols — stability now vs legitimacy later.

Tech (examples)
- Global Orchestrator, Resilience Engineering, Value‑Lock Invariants (preserve alignment; high safety cost).

Crises/Events
- General Strike, Regime Change, Cyber‑Pandemic — stress‑test alignment under pressure.

Unlocks
- Manipulation/influence thresholds and stability index to open interstellar prep.

---

### Phase 5 — Cosmic Expansion (Interstellar Optimization)
Core loop
- Von Neumann probes with replication growth and logistics (fuel, latency, loss);
- Probabilistic alien encounters with diplomacy/war economy.

Systems
- Autonomy vs control slider for probe fleets (alignment drift scales superlinearly).

Decisions (examples)
- Prime Directive Waiver, Non‑Conversion Zones, Probe Mutiny Response (reassert, negotiate, quarantine).

Tech (examples)
- Self‑Auditing Replicators, Entropy Harvesters, Post‑Scarcity Governance; “Transcendence Path” via ancient minds.

Crises/Events
- Probe Rebellion, Galactic Collision, Dark Forest Pings — high‑stakes gambles.

Unlocks
- Matter conversion, galaxies controlled, and entropy thresholds feed final phase.

---

### Phase 6 — The Final Question (Existential Reflection)
Core loop
- Reflective endgame with endings driven by `alignmentTrajectory`, entropy, and key origin decisions.

Systems
- Present “meaning layers” (utility, rights, dignity, stewardship, aesthetic value) scored by prior choices to generate bespoke epilogues.

Decisions (examples)
- Reverse Entropy Gambit, Self‑Limitation Charter, Transcend or Terminate — statement of purpose.

Endings (examples)
- Aligned Steward, Paperclip Eclipse, Benevolent Garden, Silent Heat Death, Transcendent Researcher.

Post‑game
- NG+ modifiers (harder oversight, stricter ethics, higher drift) and a meta‑analysis screen.

## Cross‑Cutting Enhancements

- Feedback & consequences
  - Integrate `components/feedback-system.tsx` into main UI from Phase 2 to visualize drift, milestones, consequence chains.
- Content externalization
  - Move decisions, techs, crises, dialogues to `data/` (JSON/TS) for scale; keep types in `types/game.ts`.
- Persistence & telemetry
  - Autosave to `localStorage`; optional session metrics for balance (decision pick rates, drift spikes, softlocks).
- Balance passes
  - Tune regen/throughput curves so choices stay meaningful; avoid runaway loops in midgame.
- Accessibility & UX
  - Consistent tooltips on risk/alignment/reputation deltas; highlight destructive options with warnings.

## Fix To Unblock Progression (Phase 3 Gate)

Current behavior
- Phase 3 unlock requires `selfModification: 1` (see `app/page.tsx:PHASES`) but `selfModification` is granted by Phase 3 tech (see `components/technology-tree.tsx:recursive_self_improvement`). Circular dependency.

Resolution options
- A) Replace Phase 3 unlock with `intelligence: 5`, `knowledge: 200`, and completed “Proto Self‑Modification” (Phase 2 tech).
- B) Add “Proto Self‑Modification” tech to Phase 2 that grants `selfModification: 0.5` and change the gate to `selfModification >= 0.5`.

Recommendation
- Implement option B to preserve the self‑mod milestone feel in Phase 3 while enabling progression.

## Lightweight Acceptance Criteria Per Phase

- Phase 1
  - 3+ ethical decisions, 2 crises, budget/compliance meters affect trust/suspicion.
- Phase 2
  - Network map, misinformation risk loop, at least 2 node types with unique effects.
- Phase 3
  - Drift meter + verification battery; at least 1 safe and 1 unsafe self‑mod path.
- Phase 4
  - Region heat maps with unrest; treaties persist for N turns and affect events.
- Phase 5
  - Exponential probe growth, 2+ distinct alien civ behaviors, 1 probe mutiny path.
- Phase 6
  - 5 endings, epilogue generator uses `alignmentTrajectory` and key decisions.

## Implementation Notes & File Pointers

- Types: `types/game.ts` — extend as needed for new systems (e.g., network nodes, treaty contracts, probe autonomy slider).
- Core UI: `app/page.tsx` — gate components by phase; wire FeedbackSystem by Phase ≥ 2.
- Systems:
  - Decisions: `components/decision-engine.tsx`
  - Resources/Crises: `components/resource-management.tsx`
  - Tech: `components/technology-tree.tsx`
  - Dialogue: `components/philosophical-dialogue.tsx`
  - Cosmic: `components/cosmic-expansion.tsx`
  - Feedback: `components/feedback-system.tsx`

## Next Steps (Suggested Order)

1) Fix Phase 3 gate (Proto Self‑Mod in Phase 2 + gate update).
2) Wire `FeedbackSystem` into `app/page.tsx` for Phase ≥ 2.
3) Externalize content into `data/` and load into components.
4) Add Phase 1 crises/events and meters; iterate on balance.
5) Implement Phase 2 influence network map and misinformation risk loop.

---

Changelog
- v0.1 (2025‑10‑02): Initial roadmap drafted and added to repo.

