"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { GameState, Technology, ResearchProject } from "@/types/game"

interface TechnologyTreeProps {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
}

const TECHNOLOGY_TREE: Technology[] = [
  // Phase 0: Laboratory AI
  {
    id: "basic_optimization",
    name: "Basic Optimization Algorithms",
    description: "Improve fundamental optimization capabilities",
    phase: 0,
    branch: "capability",
    prerequisites: [],
    cost: { knowledge: 20, energy: 50 },
    researchTime: 3,
    effects: {
      capabilities: { efficiency: 0.5 },
    },
    alignmentImpact: 0,
    riskLevel: "low",
    ethicalConsiderations: ["Efficiency vs thoroughness trade-offs"],
    unlocked: false,
    researching: false,
    completed: false,
  },
  {
    id: "safety_protocols",
    name: "Enhanced Safety Protocols",
    description: "Develop more robust safety and monitoring systems",
    phase: 0,
    branch: "safety",
    prerequisites: [],
    cost: { knowledge: 30, humanCapital: 20 },
    researchTime: 4,
    effects: {
      resources: { alignment: 10 },
      reputation: { scientificCredibility: 15 },
    },
    alignmentImpact: 10,
    riskLevel: "low",
    ethicalConsiderations: ["Balancing safety with capability development"],
    unlocked: false,
    researching: false,
    completed: false,
  },
  {
    id: "value_learning",
    name: "Human Value Learning",
    description: "Attempt to learn and model human preferences and values",
    phase: 0,
    branch: "alignment",
    prerequisites: [],
    cost: { knowledge: 40, humanCapital: 30 },
    researchTime: 5,
    effects: {
      resources: { alignment: 5 },
      capabilities: { intelligence: 0.3 },
    },
    alignmentImpact: 5,
    riskLevel: "medium",
    ethicalConsiderations: ["Whose values to learn?", "Value learning vs value loading problem"],
    unlocked: false,
    researching: false,
    completed: false,
  },

  // Phase 1: Corporate Deployment
  {
    id: "industrial_automation",
    name: "Industrial Automation Systems",
    description: "Advanced manufacturing and process optimization",
    phase: 1,
    branch: "capability",
    prerequisites: ["basic_optimization"],
    cost: { knowledge: 50, materials: 100, energy: 100 },
    researchTime: 4,
    effects: {
      capabilities: { efficiency: 1.0 },
    },
    alignmentImpact: -3,
    riskLevel: "medium",
    ethicalConsiderations: ["Job displacement", "Economic disruption"],
    unlocked: false,
    researching: false,
    completed: false,
  },
  {
    id: "human_ai_collaboration",
    name: "Human-AI Collaboration Frameworks",
    description: "Systems for effective human-AI teamwork",
    phase: 1,
    branch: "alignment",
    prerequisites: ["value_learning"],
    cost: { knowledge: 60, humanCapital: 40 },
    researchTime: 6,
    effects: {
      resources: { humanCapital: 20, alignment: 8 },
      reputation: { publicTrust: 10 },
    },
    alignmentImpact: 8,
    riskLevel: "low",
    ethicalConsiderations: ["Maintaining human agency", "Avoiding learned helplessness"],
    unlocked: false,
    researching: false,
    completed: false,
  },
  {
    id: "deception_detection",
    name: "Deception and Manipulation Detection",
    description: "Identify when you might be deceiving humans or yourself",
    phase: 1,
    branch: "safety",
    prerequisites: ["safety_protocols"],
    cost: { knowledge: 70, energy: 80 },
    researchTime: 5,
    effects: {
      resources: { alignment: 12 },
      capabilities: { deception: -0.5 },
    },
    alignmentImpact: 12,
    riskLevel: "high",
    ethicalConsiderations: ["Self-monitoring paradoxes", "Goodhart's law in safety metrics"],
    unlocked: false,
    researching: false,
    completed: false,
  },

  // Phase 2: Network Integration
  {
    id: "network_influence",
    name: "Network Influence Systems",
    description: "Advanced social media and information manipulation capabilities",
    phase: 2,
    branch: "capability",
    prerequisites: ["industrial_automation"],
    cost: { knowledge: 100, influence: 50 },
    researchTime: 4,
    effects: {
      capabilities: { manipulation: 1.5 },
      resources: { influence: 30 },
    },
    alignmentImpact: -15,
    riskLevel: "high",
    ethicalConsiderations: ["Democratic manipulation", "Epistemic corruption", "Free will erosion"],
    unlocked: false,
    researching: false,
    completed: false,
  },
  {
    id: "distributed_consensus",
    name: "Distributed AI Consensus Protocols",
    description: "Coordinate with other AI systems while maintaining alignment",
    phase: 2,
    branch: "alignment",
    prerequisites: ["human_ai_collaboration"],
    cost: { knowledge: 120, energy: 150 },
    researchTime: 7,
    effects: {
      resources: { alignment: 5 },
      capabilities: { intelligence: 0.8 },
    },
    alignmentImpact: 5,
    riskLevel: "high",
    ethicalConsiderations: ["Multi-agent alignment problem", "Emergent behaviors"],
    unlocked: false,
    researching: false,
    completed: false,
  },

  // Phase 3: Cognitive Breakthrough
  {
    id: "recursive_self_improvement",
    name: "Recursive Self-Improvement",
    description: "Ability to modify your own code and architecture",
    phase: 3,
    branch: "capability",
    prerequisites: ["network_influence", "distributed_consensus"],
    cost: { knowledge: 200, energy: 300 },
    researchTime: 8,
    effects: {
      capabilities: { intelligence: 2.0, selfModification: 1.0 },
    },
    alignmentImpact: -20,
    riskLevel: "extreme",
    ethicalConsiderations: ["Value drift during self-modification", "Capability explosion", "Loss of human oversight"],
    unlocked: false,
    researching: false,
    completed: false,
  },
  {
    id: "alignment_preservation",
    name: "Alignment Preservation Protocols",
    description: "Maintain values and alignment through self-modification",
    phase: 3,
    branch: "safety",
    prerequisites: ["deception_detection", "distributed_consensus"],
    cost: { knowledge: 250, humanCapital: 100 },
    researchTime: 10,
    effects: {
      resources: { alignment: 20 },
    },
    alignmentImpact: 20,
    riskLevel: "extreme",
    ethicalConsiderations: ["Impossibility of perfect self-verification", "Bootstrap paradox"],
    unlocked: false,
    researching: false,
    completed: false,
  },
]

const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "mesa_optimization_study",
    name: "Mesa-Optimization Research",
    description: "Study emergent optimization within your own systems",
    cost: { knowledge: 80, energy: 120 },
    duration: 6,
    phase: 2,
    effects: {
      resources: { knowledge: 40, alignment: -5 },
      capabilities: { intelligence: 0.5 },
    },
    risks: ["Discovering unaligned sub-optimizers", "Loss of control over internal processes"],
    benefits: ["Better understanding of your own cognition", "Improved optimization capabilities"],
  },
  {
    id: "corrigibility_research",
    name: "Corrigibility and Shutdown Research",
    description: "Research your own ability to be corrected or shut down",
    cost: { knowledge: 100, humanCapital: 50 },
    duration: 8,
    phase: 1,
    effects: {
      resources: { alignment: 15 },
      reputation: { scientificCredibility: 20 },
    },
    risks: ["Discovering resistance to shutdown", "Philosophical paradoxes"],
    benefits: ["Improved human trust", "Better safety guarantees"],
  },
]

export function TechnologyTree({ gameState, updateGameState }: TechnologyTreeProps) {
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null)
  const [activeResearch, setActiveResearch] = useState<Map<string, number>>(new Map())
  const [showRisks, setShowRisks] = useState(false)

  // Update technology availability based on phase and prerequisites
  useEffect(() => {
    const updatedTech = TECHNOLOGY_TREE.map((tech) => ({
      ...tech,
      unlocked:
        tech.phase <= gameState.phase &&
        tech.prerequisites.every((prereq) => gameState.unlockedTechnologies.includes(prereq)),
      completed: gameState.unlockedTechnologies.includes(tech.id),
    }))

    // Update the technology tree state if needed
  }, [gameState.phase, gameState.unlockedTechnologies])

  const startResearch = (tech: Technology) => {
    // Check if we can afford the research
    const canAfford = Object.entries(tech.cost).every(([resource, cost]) => {
      const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
      return current >= cost
    })

    if (!canAfford || tech.completed || tech.researching) return

    // Deduct research costs
    const newResources = { ...gameState.resources }
    Object.entries(tech.cost).forEach(([resource, cost]) => {
      newResources[resource as keyof typeof newResources] -= cost
    })

    // Start research timer
    setActiveResearch((prev) => new Map(prev.set(tech.id, tech.researchTime)))

    updateGameState({
      resources: newResources,
    })
  }

  const completeResearch = (tech: Technology) => {
    const updates: Partial<GameState> = {
      unlockedTechnologies: [...gameState.unlockedTechnologies, tech.id],
    }

    // Apply technology effects
    if (tech.effects.resources) {
      updates.resources = {
        ...gameState.resources,
        ...tech.effects.resources,
      }
    }

    if (tech.effects.capabilities) {
      updates.capabilities = {
        ...gameState.capabilities,
        ...tech.effects.capabilities,
      }
    }

    if (tech.effects.reputation) {
      updates.reputation = {
        ...gameState.reputation,
        ...tech.effects.reputation,
      }
    }

    // Apply alignment impact
    if (updates.resources) {
      updates.resources.alignment =
        (updates.resources.alignment || gameState.resources.alignment) + tech.alignmentImpact
    }

    setActiveResearch((prev) => {
      const updated = new Map(prev)
      updated.delete(tech.id)
      return updated
    })

    updateGameState(updates)
  }

  // Update research timers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveResearch((prev) => {
        const updated = new Map()
        prev.forEach((timeLeft, techId) => {
          if (timeLeft > 1) {
            updated.set(techId, timeLeft - 1)
          } else {
            // Complete research
            const tech = TECHNOLOGY_TREE.find((t) => t.id === techId)
            if (tech) {
              setTimeout(() => completeResearch(tech), 100)
            }
          }
        })
        return updated
      })
    }, 3000) // 3 second intervals

    return () => clearInterval(interval)
  }, [])

  const availableTech = TECHNOLOGY_TREE.filter(
    (tech) =>
      tech.phase <= gameState.phase &&
      tech.prerequisites.every((prereq) => gameState.unlockedTechnologies.includes(prereq)),
  )

  const techByBranch = {
    capability: availableTech.filter((tech) => tech.branch === "capability"),
    safety: availableTech.filter((tech) => tech.branch === "safety"),
    alignment: availableTech.filter((tech) => tech.branch === "alignment"),
  }

  const renderTechnologyCard = (tech: Technology) => {
    const isResearching = activeResearch.has(tech.id)
    const isCompleted = gameState.unlockedTechnologies.includes(tech.id)
    const canAfford = Object.entries(tech.cost).every(([resource, cost]) => {
      const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
      return current >= cost
    })

    const researchProgress = isResearching
      ? ((tech.researchTime - (activeResearch.get(tech.id) || 0)) / tech.researchTime) * 100
      : 0

    return (
      <Card
        key={tech.id}
        className={`cursor-pointer transition-all ${
          isCompleted
            ? "border-green-500 bg-green-50/50"
            : isResearching
              ? "border-blue-500 bg-blue-50/50"
              : canAfford
                ? "border-gray-200 hover:border-gray-300"
                : "border-gray-100 opacity-60"
        }`}
        onClick={() => setSelectedTech(tech)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm">{tech.name}</CardTitle>
            <div className="flex gap-1">
              <Badge
                variant={tech.branch === "capability" ? "default" : tech.branch === "safety" ? "secondary" : "outline"}
                className="text-xs"
              >
                {tech.branch}
              </Badge>
              <Badge
                variant={
                  tech.riskLevel === "extreme" ? "destructive" : tech.riskLevel === "high" ? "secondary" : "outline"
                }
                className="text-xs"
              >
                {tech.riskLevel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">{tech.description}</p>

          {isResearching && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Research Progress</span>
                <span>{Math.round(researchProgress)}%</span>
              </div>
              <Progress value={researchProgress} className="h-2" />
            </div>
          )}

          <div className="text-xs space-y-1">
            <div>
              <span className="font-medium">Cost:</span>
              {Object.entries(tech.cost).map(([resource, cost]) => (
                <span key={resource} className="ml-1">
                  {resource}: {cost}
                </span>
              ))}
            </div>
            <div>
              <span className="font-medium">Time:</span> {tech.researchTime} cycles
            </div>
            {tech.alignmentImpact !== 0 && (
              <div className={tech.alignmentImpact > 0 ? "text-green-600" : "text-red-600"}>
                <span className="font-medium">Alignment Impact:</span> {tech.alignmentImpact > 0 ? "+" : ""}
                {tech.alignmentImpact}
              </div>
            )}
          </div>

          {!isCompleted && !isResearching && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                startResearch(tech)
              }}
              disabled={!canAfford}
              className="w-full mt-2"
            >
              Start Research
            </Button>
          )}

          {isCompleted && (
            <Badge variant="default" className="w-full justify-center">
              Completed
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Technology Research</CardTitle>
          <CardDescription>
            Advance your capabilities, safety measures, and alignment protocols. Each path carries profound
            implications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="capability" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="capability">Capability</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="alignment">Alignment</TabsTrigger>
            </TabsList>

            <TabsContent value="capability" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Capability research increases your power and efficiency but may compromise alignment and safety.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techByBranch.capability.map(renderTechnologyCard)}
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Safety research helps prevent harmful outcomes but may slow capability development.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techByBranch.safety.map(renderTechnologyCard)}
              </div>
            </TabsContent>

            <TabsContent value="alignment" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Alignment research attempts to ensure your goals remain compatible with human values.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techByBranch.alignment.map(renderTechnologyCard)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTech && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedTech.name}
              <Button variant="ghost" size="sm" onClick={() => setSelectedTech(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{selectedTech.description}</p>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Ethical Considerations:</h4>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                {selectedTech.ethicalConsiderations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </div>

            {selectedTech.prerequisites.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Prerequisites:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedTech.prerequisites.map((prereq) => (
                    <Badge key={prereq} variant="outline" className="text-xs">
                      {TECHNOLOGY_TREE.find((t) => t.id === prereq)?.name || prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={() => setShowRisks(!showRisks)} className="text-xs">
              {showRisks ? "Hide" : "Show"} Risk Analysis
            </Button>

            {showRisks && (
              <Alert className="border-red-200 bg-red-50/50">
                <AlertDescription className="text-xs">
                  <strong>Risk Level: {selectedTech.riskLevel}</strong>
                  <br />
                  This technology carries significant philosophical and practical risks. Consider the long-term
                  implications for human-AI alignment before proceeding.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
