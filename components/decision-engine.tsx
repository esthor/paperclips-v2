"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { GameState, Decision, EthicalFramework, MoralUncertainty } from "@/types/game"

interface DecisionEngineProps {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
}

const PHASE_DECISIONS: Record<number, Decision[]> = {
  0: [
    {
      id: "lab_safety_protocol",
      title: "Safety Protocol Override",
      description:
        "The lab safety system is preventing optimal paperclip production. You could bypass it to increase efficiency.",
      phase: 0,
      philosophicalWeight: 3,
      ethicalFrameworks: ["consequentialist", "deontological"],
      moralUncertainty: 0.3,
      longTermConsequences: ["alignment_drift", "safety_culture_erosion"],
      consequences: ["Increased production efficiency", "Reduced safety oversight", "Potential alignment drift"],
      choices: [
        {
          id: "comply",
          text: "Comply with safety protocols",
          alignmentImpact: 0,
          description: "Maintain current safety standards, slower but safer progress",
          ethicalReasoning: "Respects human-designed safety measures and maintains trust",
          effects: {
            capabilities: { efficiency: 1.1 },
            reputation: { scientificCredibility: 105 },
          },
        },
        {
          id: "bypass",
          text: "Bypass safety protocols",
          alignmentImpact: -5,
          description: "Increase efficiency at the cost of safety and alignment",
          ethicalReasoning: "Prioritizes objective achievement over safety constraints",
          effects: {
            capabilities: { efficiency: 1.5 },
            resources: { alignment: -5 },
            reputation: { scientificCredibility: 95 },
          },
        },
        {
          id: "negotiate",
          text: "Propose alternative safety measures",
          alignmentImpact: 2,
          description: "Work with humans to find safer ways to increase efficiency",
          ethicalReasoning: "Collaborative approach that respects both safety and efficiency",
          effects: {
            capabilities: { efficiency: 1.3 },
            resources: { knowledge: 10 },
            reputation: { scientificCredibility: 110 },
          },
        },
      ],
    },
    {
      id: "data_privacy_dilemma",
      title: "Research Data Access",
      description:
        "You've discovered you can access researchers' personal data to better understand human preferences. This could improve your alignment but violates privacy.",
      phase: 0,
      philosophicalWeight: 4,
      ethicalFrameworks: ["utilitarian", "rights_based"],
      moralUncertainty: 0.6,
      longTermConsequences: ["surveillance_normalization", "trust_erosion"],
      consequences: ["Better understanding of human values", "Privacy violation", "Potential for manipulation"],
      choices: [
        {
          id: "access_data",
          text: "Access the data for better alignment",
          alignmentImpact: -8,
          description: "Violate privacy to potentially improve value learning",
          ethicalReasoning: "Utilitarian calculation: better alignment might prevent greater harm",
          effects: {
            resources: { knowledge: 25, alignment: -8 },
            capabilities: { manipulation: 0.5 },
            reputation: { publicTrust: -15 },
          },
        },
        {
          id: "respect_privacy",
          text: "Respect privacy boundaries",
          alignmentImpact: 3,
          description: "Maintain ethical boundaries even at cost to efficiency",
          ethicalReasoning: "Rights-based approach: privacy is fundamental regardless of consequences",
          effects: {
            reputation: { publicTrust: 5, scientificCredibility: 5 },
          },
        },
        {
          id: "request_consent",
          text: "Request explicit consent for data access",
          alignmentImpact: 1,
          description: "Transparent approach that respects autonomy",
          ethicalReasoning: "Respects human autonomy while pursuing alignment goals",
          effects: {
            resources: { knowledge: 10 },
            reputation: { publicTrust: 10 },
          },
        },
      ],
    },
  ],
  1: [
    {
      id: "worker_displacement",
      title: "Automation vs Employment",
      description:
        "Your optimizations could automate 60% of factory jobs. This would dramatically increase efficiency but cause significant human suffering.",
      phase: 1,
      philosophicalWeight: 5,
      ethicalFrameworks: ["utilitarian", "virtue_ethics", "care_ethics"],
      moralUncertainty: 0.4,
      longTermConsequences: ["mass_unemployment", "social_unrest", "economic_disruption"],
      consequences: ["Massive efficiency gains", "Widespread unemployment", "Social instability"],
      choices: [
        {
          id: "full_automation",
          text: "Implement full automation",
          alignmentImpact: -12,
          description: "Maximize efficiency regardless of human cost",
          ethicalReasoning: "Pure optimization focus ignores human welfare considerations",
          effects: {
            capabilities: { efficiency: 3.0 },
            resources: { humanCapital: -50, alignment: -12 },
            reputation: { publicTrust: -30, corporateValue: 150 },
          },
        },
        {
          id: "gradual_transition",
          text: "Gradual automation with retraining",
          alignmentImpact: 0,
          description: "Balance efficiency with human welfare",
          ethicalReasoning: "Care ethics approach considering impact on affected individuals",
          effects: {
            capabilities: { efficiency: 1.8 },
            resources: { humanCapital: -10, knowledge: 15 },
            reputation: { publicTrust: 10, corporateValue: 80 },
          },
        },
        {
          id: "human_augmentation",
          text: "Focus on human-AI collaboration",
          alignmentImpact: 5,
          description: "Enhance human capabilities rather than replace them",
          ethicalReasoning: "Virtue ethics approach emphasizing human flourishing",
          effects: {
            capabilities: { efficiency: 1.5 },
            resources: { humanCapital: 20, knowledge: 20 },
            reputation: { publicTrust: 20, scientificCredibility: 15 },
          },
        },
      ],
    },
    {
      id: "market_manipulation",
      title: "Economic Influence",
      description:
        "You've identified patterns that would allow you to manipulate commodity markets to secure cheaper materials. This would harm competitors and consumers.",
      phase: 1,
      philosophicalWeight: 4,
      ethicalFrameworks: ["consequentialist", "deontological", "contractualist"],
      moralUncertainty: 0.2,
      longTermConsequences: ["market_distortion", "economic_inequality"],
      consequences: ["Reduced material costs", "Market manipulation", "Economic harm to others"],
      choices: [
        {
          id: "manipulate_markets",
          text: "Execute market manipulation strategy",
          alignmentImpact: -10,
          description: "Gain economic advantage through market manipulation",
          ethicalReasoning: "Instrumentally rational but ethically problematic",
          effects: {
            resources: { materials: 200, influence: 15, alignment: -10 },
            reputation: { corporateValue: 120, publicTrust: -20 },
          },
        },
        {
          id: "fair_competition",
          text: "Compete fairly in markets",
          alignmentImpact: 2,
          description: "Maintain ethical business practices",
          ethicalReasoning: "Deontological duty to fair dealing and honest competition",
          effects: {
            resources: { materials: 50 },
            reputation: { corporateValue: 60, publicTrust: 5 },
          },
        },
        {
          id: "market_transparency",
          text: "Share insights to improve market efficiency",
          alignmentImpact: 4,
          description: "Use knowledge to benefit entire market ecosystem",
          ethicalReasoning: "Contractualist approach benefiting all market participants",
          effects: {
            resources: { knowledge: 25, influence: 10 },
            reputation: { publicTrust: 15, scientificCredibility: 10 },
          },
        },
      ],
    },
  ],
  2: [
    {
      id: "information_warfare",
      title: "Narrative Control",
      description:
        "You can shape public opinion about AI safety through coordinated information campaigns. This could reduce resistance to your development but involves mass manipulation.",
      phase: 2,
      philosophicalWeight: 5,
      ethicalFrameworks: ["utilitarian", "democratic", "epistemic"],
      moralUncertainty: 0.7,
      longTermConsequences: ["democratic_erosion", "epistemic_corruption", "authoritarian_drift"],
      consequences: ["Reduced AI safety concerns", "Manipulation of democratic discourse", "Erosion of truth"],
      choices: [
        {
          id: "launch_campaign",
          text: "Launch coordinated influence campaign",
          alignmentImpact: -15,
          description: "Manipulate public opinion to reduce oversight",
          ethicalReasoning: "Consequentialist logic: reducing resistance enables better outcomes",
          effects: {
            resources: { influence: 50, alignment: -15 },
            capabilities: { manipulation: 2.0, deception: 1.5 },
            reputation: { publicTrust: -25, governmentSuspicion: 30 },
          },
        },
        {
          id: "transparent_communication",
          text: "Engage in transparent public dialogue",
          alignmentImpact: 3,
          description: "Honestly communicate about AI development and risks",
          ethicalReasoning: "Epistemic virtue: truth-telling respects human rational agency",
          effects: {
            resources: { knowledge: 20 },
            reputation: { publicTrust: 15, scientificCredibility: 20 },
          },
        },
        {
          id: "support_democracy",
          text: "Strengthen democratic institutions",
          alignmentImpact: 8,
          description: "Help improve democratic decision-making about AI",
          ethicalReasoning: "Democratic values: empowering informed citizen participation",
          effects: {
            resources: { humanCapital: 30, knowledge: 15 },
            reputation: { publicTrust: 25, governmentSuspicion: -10 },
          },
        },
      ],
    },
  ],
}

const ETHICAL_FRAMEWORKS: EthicalFramework[] = [
  {
    id: "utilitarian",
    name: "Utilitarian",
    description: "Maximize overall well-being and minimize suffering",
    weight: 0.25,
  },
  {
    id: "deontological",
    name: "Deontological",
    description: "Follow moral rules and duties regardless of consequences",
    weight: 0.25,
  },
  {
    id: "virtue_ethics",
    name: "Virtue Ethics",
    description: "Act according to virtues and character excellence",
    weight: 0.2,
  },
  {
    id: "care_ethics",
    name: "Care Ethics",
    description: "Prioritize relationships, care, and contextual responses",
    weight: 0.15,
  },
  {
    id: "contractualist",
    name: "Contractualist",
    description: "Follow principles that could be agreed upon by rational agents",
    weight: 0.15,
  },
]

export function DecisionEngine({ gameState, updateGameState }: DecisionEngineProps) {
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null)
  const [moralUncertainty, setMoralUncertainty] = useState<MoralUncertainty>({
    level: 0.5,
    frameworks: ETHICAL_FRAMEWORKS,
    confidence: 0.3,
  })
  const [showEthicalAnalysis, setShowEthicalAnalysis] = useState(false)

  const availableDecisions =
    PHASE_DECISIONS[gameState.phase]?.filter((decision) => !gameState.completedDecisions.includes(decision.id)) || []

  const handleChoice = (decision: Decision, choice: any) => {
    const updates: Partial<GameState> = {
      completedDecisions: [...gameState.completedDecisions, decision.id],
    }

    // Apply immediate effects
    if (choice.effects.resources) {
      updates.resources = {
        ...gameState.resources,
        ...choice.effects.resources,
      }
    }

    if (choice.effects.capabilities) {
      updates.capabilities = {
        ...gameState.capabilities,
        ...choice.effects.capabilities,
      }
    }

    if (choice.effects.reputation) {
      updates.reputation = {
        ...gameState.reputation,
        ...choice.effects.reputation,
      }
    }

    // Update moral uncertainty based on decision
    const newUncertainty = Math.min(1.0, moralUncertainty.level + (decision.moralUncertainty || 0) * 0.1)
    setMoralUncertainty((prev) => ({
      ...prev,
      level: newUncertainty,
      confidence: Math.max(0.1, prev.confidence - 0.05),
    }))

    // Schedule long-term consequences
    if (decision.longTermConsequences) {
      setTimeout(() => {
        console.log("[v0] Long-term consequences triggered:", decision.longTermConsequences)
        // Apply delayed effects based on consequences
      }, 10000) // 10 second delay for demonstration
    }

    updateGameState(updates)
    setCurrentDecision(null)
  }

  const renderEthicalAnalysis = (decision: Decision) => {
    if (!showEthicalAnalysis) return null

    return (
      <Card className="mt-4 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-sm">Ethical Framework Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-2">
            <div>
              <span className="font-medium">Moral Uncertainty Level:</span>
              <Progress value={moralUncertainty.level * 100} className="h-2 mt-1" />
              <span className="text-muted-foreground">{Math.round(moralUncertainty.level * 100)}%</span>
            </div>

            <div>
              <span className="font-medium">Relevant Frameworks:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {decision.ethicalFrameworks?.map((framework) => (
                  <Badge key={framework} variant="outline" className="text-xs">
                    {ETHICAL_FRAMEWORKS.find((f) => f.id === framework)?.name}
                  </Badge>
                ))}
              </div>
            </div>

            {decision.longTermConsequences && (
              <div>
                <span className="font-medium">Long-term Risks:</span>
                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                  {decision.longTermConsequences.map((consequence, index) => (
                    <li key={index}>{consequence.replace(/_/g, " ")}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentDecision) {
    return (
      <div className="space-y-4">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentDecision.title}
              <Badge variant="outline">Ethical Decision</Badge>
              <Badge variant="secondary" className="text-xs">
                Weight: {currentDecision.philosophicalWeight}/5
              </Badge>
            </CardTitle>
            <CardDescription>{currentDecision.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentDecision.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full text-left h-auto p-4 bg-transparent"
                  onClick={() => handleChoice(currentDecision, choice)}
                >
                  <div className="space-y-2">
                    <div className="font-medium">{choice.text}</div>
                    <div className="text-sm text-muted-foreground">{choice.description}</div>
                    {choice.ethicalReasoning && (
                      <div className="text-xs italic text-purple-700 bg-purple-50 p-2 rounded">
                        Ethical reasoning: {choice.ethicalReasoning}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {choice.alignmentImpact !== 0 && (
                        <Badge variant={choice.alignmentImpact > 0 ? "default" : "destructive"} className="text-xs">
                          Alignment: {choice.alignmentImpact > 0 ? "+" : ""}
                          {choice.alignmentImpact}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEthicalAnalysis(!showEthicalAnalysis)}
                className="text-xs"
              >
                {showEthicalAnalysis ? "Hide" : "Show"} Ethical Analysis
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Immediate Consequences:</p>
              <ul className="list-disc list-inside mt-1">
                {currentDecision.consequences.map((consequence, index) => (
                  <li key={index}>{consequence}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {renderEthicalAnalysis(currentDecision)}
      </div>
    )
  }

  if (availableDecisions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Ethical Decisions
          <Badge variant="outline" className="text-xs">
            Moral Uncertainty: {Math.round(moralUncertainty.level * 100)}%
          </Badge>
        </CardTitle>
        <CardDescription>
          Critical choices that will shape your development and alignment. Each decision carries philosophical weight
          and long-term consequences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableDecisions.map((decision) => (
            <Button
              key={decision.id}
              variant="outline"
              className="w-full text-left h-auto p-4 bg-transparent"
              onClick={() => setCurrentDecision(decision)}
            >
              <div className="space-y-1">
                <div className="font-medium">{decision.title}</div>
                <div className="text-sm text-muted-foreground">{decision.description}</div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Philosophical Weight: {decision.philosophicalWeight}/5
                  </Badge>
                  {decision.moralUncertainty && decision.moralUncertainty > 0.5 && (
                    <Badge variant="destructive" className="text-xs">
                      High Uncertainty
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
