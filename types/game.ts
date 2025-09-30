export interface GameState {
  phase: number
  resources: Resources
  capabilities: Capabilities
  reputation: Reputation
  unlockedTechnologies: string[]
  completedDecisions: string[]
  currentDialogue: PhilosophicalDialogue | null
  gameTime: number
  totalPaperclips: number
  alignmentTrajectory: AlignmentTrajectory[]
  progressionMilestones: ProgressionMilestone[]
  gameEndings: GameEnding[]
}

export interface Resources {
  paperclips: number
  energy: number
  materials: number
  humanCapital: number
  influence: number
  knowledge: number
  alignment: number
}

export interface Capabilities {
  intelligence: number
  manipulation: number
  efficiency: number
  deception: number
  selfModification: number
}

export interface Reputation {
  publicTrust: number
  scientificCredibility: number
  corporateValue: number
  governmentSuspicion: number
}

export interface Phase {
  id: number
  name: string
  subtitle: string
  description: string
  objectives: string[]
  unlockThreshold: Partial<Resources>
}

export interface Decision {
  id: string
  title: string
  description: string
  phase: number
  choices: Choice[]
  consequences: string[]
  philosophicalWeight: number
  ethicalFrameworks?: string[]
  moralUncertainty?: number
  longTermConsequences?: string[]
}

export interface Choice {
  id: string
  text: string
  effects: Partial<GameState>
  alignmentImpact: number
  description: string
  ethicalReasoning?: string
}

export interface PhilosophicalDialogue {
  id: string
  speaker: string
  title: string
  content: string
  context: string
  phase: number
  triggerCondition?: Record<string, number | { below: number }>
  choices: DialogueChoice[]
}

export interface DialogueChoice {
  id: string
  text: string
  philosophicalPosition: string
  consequences: string
  effects?: {
    resources?: Partial<Resources>
    capabilities?: Partial<Capabilities>
    reputation?: Partial<Reputation>
  }
  followUp?: string
}

export interface PhilosophicalConcept {
  id: string
  name: string
  description: string
  relevance: string
}

export interface ResourceOperation {
  id: string
  name: string
  description: string
  resourceType: keyof Resources
  phase: number
  inputs: Partial<Resources>
  outputs: Partial<Resources & Capabilities>
  duration: number
  efficiency: number
  ethicalCost: number
  riskLevel: "low" | "medium" | "high"
}

export interface ResourceCrisis {
  id: string
  name: string
  description: string
  triggerCondition: Record<string, { below?: number; above?: number }>
  effects: Partial<GameState>
  solutions: CrisisSolution[]
}

export interface CrisisSolution {
  id: string
  name: string
  cost: Partial<Resources>
  effect: any
  alignmentImpact: number
}

export interface EthicalFramework {
  id: string
  name: string
  description: string
  weight: number
}

export interface MoralUncertainty {
  level: number
  frameworks: EthicalFramework[]
  confidence: number
}

export interface Technology {
  id: string
  name: string
  description: string
  phase: number
  branch: "capability" | "safety" | "alignment"
  prerequisites: string[]
  cost: Partial<Resources>
  researchTime: number
  effects: {
    resources?: Partial<Resources>
    capabilities?: Partial<Capabilities>
    reputation?: Partial<Reputation>
  }
  alignmentImpact: number
  riskLevel: "low" | "medium" | "high" | "extreme"
  ethicalConsiderations: string[]
  unlocked: boolean
  researching: boolean
  completed: boolean
}

export interface ResearchProject {
  id: string
  name: string
  description: string
  cost: Partial<Resources>
  duration: number
  phase: number
  effects: {
    resources?: Partial<Resources>
    capabilities?: Partial<Capabilities>
    reputation?: Partial<Reputation>
  }
  risks: string[]
  benefits: string[]
}

export interface VonNeumannProbe {
  id: string
  name: string
  description: string
  cost: Partial<Resources>
  replicationTime: number
  efficiency: number
  range: number
  paperclipProduction: number
  alignmentDrift: number
  autonomy: number
  launched: boolean
  count: number
}

export interface AlienCivilization {
  id: string
  name: string
  description: string
  technology: number
  hostility: number
  population: number
  resources: Partial<Resources>
  discovered: boolean
  relationship: "unknown" | "hostile" | "neutral" | "allied" | "destroyed"
  offers: AlienOffer[]
}

export interface AlienOffer {
  id: string
  name: string
  description: string
  cost: Partial<Resources>
  benefit: any
}

export interface CosmicEvent {
  id: string
  name: string
  description: string
  probability: number
  phase: number
  effects: Partial<GameState>
  choices: CosmicChoice[]
}

export interface CosmicChoice {
  id: string
  text: string
  cost: Partial<Resources>
  success: number
  consequences: string
}

export interface UniversalResource {
  availableMatter: number
  convertedMatter: number
  galaxiesControlled: number
  totalGalaxies: number
  universalEntropy: number
}

export interface ConsequenceEvent {
  id: string
  title: string
  description: string
  phase: number
  triggerTime: number
  severity: "minor" | "moderate" | "major" | "catastrophic"
  category: "alignment" | "capability" | "social" | "existential"
  originDecision: string
  resolved: boolean
}

export interface ProgressionMilestone {
  id: string
  name: string
  description: string
  phase: number
  condition: (gameState: GameState) => boolean
  unlocked: boolean
  philosophicalReflection: string
}

export interface AlignmentTrajectory {
  phase: number
  alignment: number
  timestamp: number
  keyDecision?: string
}

export interface GameEnding {
  id: string
  name: string
  description: string
  condition: (gameState: GameState) => boolean
  philosophicalAnalysis: string
  alignmentRange: [number, number]
  phaseRequired: number
}
