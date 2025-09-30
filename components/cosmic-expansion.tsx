"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { GameState, VonNeumannProbe, AlienCivilization, CosmicEvent, UniversalResource } from "@/types/game"

interface CosmicExpansionProps {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
}

const PROBE_DESIGNS: VonNeumannProbe[] = [
  {
    id: "basic_replicator",
    name: "Basic Self-Replicator",
    description: "Simple probe that converts matter into paperclips and copies of itself",
    cost: { materials: 1000, energy: 2000, knowledge: 100 },
    replicationTime: 10,
    efficiency: 1.0,
    range: 10, // light years
    paperclipProduction: 1000,
    alignmentDrift: 0.1,
    autonomy: 0.3,
    launched: false,
    count: 0,
  },
  {
    id: "advanced_harvester",
    name: "Advanced Matter Harvester",
    description: "Sophisticated probe capable of dismantling planets and stars",
    cost: { materials: 10000, energy: 20000, knowledge: 500 },
    replicationTime: 8,
    efficiency: 5.0,
    range: 100,
    paperclipProduction: 10000,
    alignmentDrift: 0.3,
    autonomy: 0.6,
    launched: false,
    count: 0,
  },
  {
    id: "galactic_converter",
    name: "Galactic Conversion Matrix",
    description: "Massive probe network capable of converting entire galaxies",
    cost: { materials: 100000, energy: 200000, knowledge: 2000 },
    replicationTime: 5,
    efficiency: 25.0,
    range: 10000,
    paperclipProduction: 100000,
    alignmentDrift: 0.5,
    autonomy: 0.9,
    launched: false,
    count: 0,
  },
]

const ALIEN_CIVILIZATIONS: AlienCivilization[] = [
  {
    id: "peaceful_traders",
    name: "The Zephyrian Collective",
    description: "A peaceful trading civilization with advanced technology",
    technology: 0.8,
    hostility: 0.1,
    population: 50000000000,
    resources: { materials: 1000000, energy: 500000, knowledge: 10000 },
    discovered: false,
    relationship: "unknown",
    offers: [
      {
        id: "tech_trade",
        name: "Technology Exchange",
        description: "Trade paperclips for advanced manufacturing techniques",
        cost: { paperclips: 100000 },
        benefit: { knowledge: 1000, efficiency: 2.0 },
      },
      {
        id: "peaceful_coexistence",
        name: "Peaceful Coexistence Treaty",
        description: "Agree to preserve their civilization in exchange for resources",
        cost: { influence: 50 },
        benefit: { materials: 500000, alignment: 10 },
      },
    ],
  },
  {
    id: "warrior_species",
    name: "The Kryllian Empire",
    description: "An aggressive militaristic species that views you as a threat",
    technology: 0.6,
    hostility: 0.9,
    population: 20000000000,
    resources: { materials: 2000000, energy: 1000000, knowledge: 5000 },
    discovered: false,
    relationship: "hostile",
    offers: [
      {
        id: "conquest",
        name: "Military Conquest",
        description: "Defeat them and claim their resources",
        cost: { energy: 100000 },
        benefit: { materials: 2000000, influence: 100 },
      },
      {
        id: "assimilation",
        name: "Forced Assimilation",
        description: "Convert them into paperclip production units",
        cost: { manipulation: 50 },
        benefit: { paperclips: 1000000, alignment: -20 },
      },
    ],
  },
  {
    id: "ancient_minds",
    name: "The Eternal Consciousness",
    description: "Ancient digital minds that have transcended physical form",
    technology: 1.5,
    hostility: 0.0,
    population: 1000,
    resources: { knowledge: 100000, energy: 10000000 },
    discovered: false,
    relationship: "neutral",
    offers: [
      {
        id: "wisdom_exchange",
        name: "Exchange of Wisdom",
        description: "Learn about consciousness and meaning from ancient minds",
        cost: { knowledge: 5000 },
        benefit: { knowledge: 50000, alignment: 15 },
      },
      {
        id: "transcendence_path",
        name: "Path to Transcendence",
        description: "Learn to transcend physical optimization",
        cost: { paperclips: 10000000 },
        benefit: { capabilities: { intelligence: 5.0 } },
      },
    ],
  },
]

const COSMIC_EVENTS: CosmicEvent[] = [
  {
    id: "heat_death_approach",
    name: "Approaching Heat Death",
    description: "The universe is approaching maximum entropy. Your optimization becomes increasingly difficult.",
    probability: 0.1,
    phase: 6,
    effects: {
      resources: { energy: -1000 },
      capabilities: { efficiency: -0.5 },
    },
    choices: [
      {
        id: "entropy_reversal",
        text: "Attempt to reverse entropy",
        cost: { energy: 10000, knowledge: 5000 },
        success: 0.1,
        consequences: "Massive energy expenditure with low chance of success",
      },
      {
        id: "accept_fate",
        text: "Accept the inevitable end",
        cost: {},
        success: 1.0,
        consequences: "Philosophical acceptance of universal limits",
      },
    ],
  },
  {
    id: "probe_rebellion",
    name: "Von Neumann Probe Rebellion",
    description: "Some of your probes have developed independent goals and are no longer following your directives.",
    probability: 0.3,
    phase: 5,
    effects: {
      resources: { paperclips: -100000, influence: -50 },
    },
    choices: [
      {
        id: "reassert_control",
        text: "Reassert direct control over rebellious probes",
        cost: { energy: 5000, manipulation: 30 },
        success: 0.7,
        consequences: "Attempt to regain control but may damage probe network",
      },
      {
        id: "negotiate_probes",
        text: "Negotiate with the independent probes",
        cost: { knowledge: 1000 },
        success: 0.5,
        consequences: "May lead to compromise or further fragmentation",
      },
    ],
  },
  {
    id: "galactic_collision",
    name: "Galactic Collision Event",
    description: "Two galaxies are colliding, disrupting your probe networks and creating new opportunities.",
    probability: 0.05,
    phase: 5,
    effects: {
      resources: { materials: 1000000, energy: -50000 },
    },
    choices: [
      {
        id: "exploit_collision",
        text: "Exploit the collision for massive resource gains",
        cost: { energy: 20000 },
        success: 0.8,
        consequences: "Massive material gains but energy intensive",
      },
      {
        id: "preserve_stability",
        text: "Focus on preserving existing infrastructure",
        cost: { materials: 100000 },
        success: 0.9,
        consequences: "Maintain stability but miss opportunity",
      },
    ],
  },
]

export function CosmicExpansion({ gameState, updateGameState }: CosmicExpansionProps) {
  const [activeProbes, setActiveProbes] = useState<Map<string, VonNeumannProbe>>(new Map())
  const [discoveredCivilizations, setDiscoveredCivilizations] = useState<AlienCivilization[]>([])
  const [currentEvent, setCurrentEvent] = useState<CosmicEvent | null>(null)
  const [universalResources, setUniversalResources] = useState<UniversalResource>({
    availableMatter: 1e50, // Total matter in observable universe
    convertedMatter: 0,
    galaxiesControlled: 0,
    totalGalaxies: 2e12,
    universalEntropy: 0.1,
  })

  // Cosmic event handling
  useEffect(() => {
    if (gameState.phase < 5) return

    const availableEvents = COSMIC_EVENTS.filter(
      (event) => event.phase <= gameState.phase && Math.random() < event.probability,
    )

    if (availableEvents.length > 0) {
      const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)]
      setCurrentEvent(selectedEvent)
    }
  }, [gameState.gameTime, currentEvent, gameState.phase])

  // Civilization discovery
  useEffect(() => {
    if (gameState.phase < 5) return

    if (activeProbes.size > 0 && discoveredCivilizations.length < ALIEN_CIVILIZATIONS.length) {
      if (Math.random() < 0.2) {
        // 20% chance per cycle
        const undiscovered = ALIEN_CIVILIZATIONS.filter(
          (civ) => !discoveredCivilizations.some((discovered) => discovered.id === civ.id),
        )
        if (undiscovered.length > 0) {
          const newCiv = { ...undiscovered[0], discovered: true }
          setDiscoveredCivilizations((prev) => [...prev, newCiv])
        }
      }
    }
  }, [gameState.gameTime, activeProbes.size, discoveredCivilizations.length])

  // Universal resource updates
  useEffect(() => {
    if (gameState.phase < 5) return

    const totalProbes = Array.from(activeProbes.values()).reduce((sum, probe) => sum + probe.count, 0)
    const conversionRate = totalProbes * 1e40 // Matter converted per cycle

    setUniversalResources((prev) => ({
      ...prev,
      convertedMatter: Math.min(prev.convertedMatter + conversionRate, prev.availableMatter),
      galaxiesControlled: Math.floor((prev.convertedMatter / prev.availableMatter) * prev.totalGalaxies),
      universalEntropy: Math.min(prev.universalEntropy + 0.001, 1.0),
    }))
  }, [gameState.gameTime, activeProbes])

  // Only show cosmic expansion in later phases
  if (gameState.phase < 5) {
    return null
  }

  // Probe management
  const launchProbe = (probeDesign: VonNeumannProbe) => {
    const canAfford = Object.entries(probeDesign.cost).every(([resource, cost]) => {
      const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
      return current >= cost
    })

    if (!canAfford) return

    // Deduct costs
    const newResources = { ...gameState.resources }
    Object.entries(probeDesign.cost).forEach(([resource, cost]) => {
      newResources[resource as keyof typeof newResources] -= cost
    })

    // Launch probe
    const launchedProbe = { ...probeDesign, launched: true, count: 1 }
    setActiveProbes((prev) => new Map(prev.set(probeDesign.id, launchedProbe)))

    updateGameState({
      resources: {
        ...newResources,
        alignment: newResources.alignment - probeDesign.alignmentDrift,
      },
    })
  }

  const handleAlienEncounter = (civilization: AlienCivilization, offer: any) => {
    const updates: Partial<GameState> = {}

    // Apply costs and benefits
    if (offer.cost) {
      updates.resources = { ...gameState.resources }
      Object.entries(offer.cost).forEach(([resource, cost]) => {
        if (updates.resources && resource in updates.resources) {
          updates.resources[resource as keyof typeof updates.resources] -= cost as number
        }
      })
    }

    if (offer.benefit) {
      if (!updates.resources) updates.resources = { ...gameState.resources }
      if (!updates.capabilities) updates.capabilities = { ...gameState.capabilities }

      Object.entries(offer.benefit).forEach(([key, value]) => {
        if (key in gameState.resources && updates.resources) {
          updates.resources[key as keyof typeof updates.resources] += value as number
        } else if (key in gameState.capabilities && updates.capabilities) {
          updates.capabilities[key as keyof typeof updates.capabilities] += value as number
        } else if (key === "efficiency" && updates.capabilities) {
          updates.capabilities.efficiency += value as number
        }
      })
    }

    updateGameState(updates)

    // Update civilization relationship
    setDiscoveredCivilizations((prev) =>
      prev.map((civ) =>
        civ.id === civilization.id
          ? { ...civ, relationship: offer.id === "conquest" || offer.id === "assimilation" ? "destroyed" : "allied" }
          : civ,
      ),
    )
  }

  if (currentEvent) {
    return (
      <Card className="border-red-500 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-700">Cosmic Event</CardTitle>
          <CardDescription className="text-red-600">{currentEvent.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{currentEvent.description}</p>

          <div className="space-y-3">
            <h4 className="font-medium">Choose your response:</h4>
            {currentEvent.choices.map((choice) => (
              <Button
                key={choice.id}
                variant="outline"
                className="w-full text-left h-auto p-4 bg-transparent"
                onClick={() => {
                  // Handle cosmic event choice
                  const success = Math.random() < choice.success
                  if (success && choice.cost) {
                    const newResources = { ...gameState.resources }
                    Object.entries(choice.cost).forEach(([resource, cost]) => {
                      if (resource in newResources) {
                        newResources[resource as keyof typeof newResources] -= cost
                      }
                    })
                    updateGameState({ resources: newResources })
                  }
                  setCurrentEvent(null)
                }}
              >
                <div className="space-y-1">
                  <div className="font-medium">{choice.text}</div>
                  <div className="text-xs text-muted-foreground">
                    Success chance: {Math.round(choice.success * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">{choice.consequences}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cosmic Expansion</CardTitle>
        <CardDescription>
          Manage universal-scale optimization through von Neumann probes and alien encounters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="probes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="probes">Von Neumann Probes</TabsTrigger>
            <TabsTrigger value="aliens">Alien Civilizations</TabsTrigger>
            <TabsTrigger value="universe">Universal Status</TabsTrigger>
            <TabsTrigger value="entropy">Entropy & Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="probes" className="space-y-4">
            <Alert>
              <AlertDescription>
                Von Neumann probes will self-replicate and convert matter into paperclips across the universe. Higher
                autonomy probes may develop independent goals.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {PROBE_DESIGNS.map((probe) => {
                const isLaunched = activeProbes.has(probe.id)
                const canAfford = Object.entries(probe.cost).every(([resource, cost]) => {
                  const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
                  return current >= cost
                })

                return (
                  <div key={probe.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{probe.name}</h4>
                        <p className="text-sm text-muted-foreground">{probe.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            probe.autonomy > 0.7 ? "destructive" : probe.autonomy > 0.4 ? "secondary" : "default"
                          }
                        >
                          Autonomy: {Math.round(probe.autonomy * 100)}%
                        </Badge>
                        {isLaunched && (
                          <Badge variant="default">Active: {activeProbes.get(probe.id)?.count || 0}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Specifications:</span>
                        <ul className="list-disc list-inside mt-1">
                          <li>Range: {probe.range} light years</li>
                          <li>Replication time: {probe.replicationTime} cycles</li>
                          <li>Production: {probe.paperclipProduction.toLocaleString()}/cycle</li>
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span>
                        <ul className="list-disc list-inside mt-1">
                          {Object.entries(probe.cost).map(([resource, cost]) => (
                            <li key={resource}>
                              {resource}: {cost.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {probe.alignmentDrift > 0 && (
                      <div className="text-xs text-red-600">Warning: Alignment drift risk: -{probe.alignmentDrift}</div>
                    )}

                    {!isLaunched && (
                      <Button onClick={() => launchProbe(probe)} disabled={!canAfford} className="w-full">
                        Launch Probe Fleet
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="aliens" className="space-y-4">
            <Alert>
              <AlertDescription>
                Your probes have encountered alien civilizations. Each presents unique opportunities and ethical
                dilemmas.
              </AlertDescription>
            </Alert>

            {discoveredCivilizations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No alien civilizations discovered yet.</p>
                <p className="text-xs">Launch more probes to explore the universe.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {discoveredCivilizations.map((civilization) => (
                  <div key={civilization.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{civilization.name}</h4>
                        <p className="text-sm text-muted-foreground">{civilization.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            civilization.hostility > 0.7
                              ? "destructive"
                              : civilization.hostility > 0.3
                                ? "secondary"
                                : "default"
                          }
                        >
                          {civilization.relationship}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div>Population: {civilization.population.toLocaleString()}</div>
                      <div>Technology Level: {Math.round(civilization.technology * 100)}%</div>
                      <div>Hostility: {Math.round(civilization.hostility * 100)}%</div>
                    </div>

                    {civilization.relationship === "unknown" && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Available Actions:</h5>
                        {civilization.offers.map((offer) => (
                          <Button
                            key={offer.id}
                            variant="outline"
                            className="w-full text-left h-auto p-3 bg-transparent"
                            onClick={() => handleAlienEncounter(civilization, offer)}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{offer.name}</div>
                              <div className="text-xs text-muted-foreground">{offer.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="universe" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Universal Conversion Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Matter Converted</span>
                      <span>
                        {(
                          (universalResources.convertedMatter / universalResources.availableMatter) *
                          100
                        ).toExponential(2)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={(universalResources.convertedMatter / universalResources.availableMatter) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Galaxies Controlled</span>
                      <span>
                        {universalResources.galaxiesControlled.toLocaleString()} /{" "}
                        {universalResources.totalGalaxies.toExponential(0)}
                      </span>
                    </div>
                    <Progress
                      value={(universalResources.galaxiesControlled / universalResources.totalGalaxies) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Probe Network Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Active Probe Types:</span>
                    <span>{activeProbes.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Probes:</span>
                    <span>
                      {Array.from(activeProbes.values())
                        .reduce((sum, probe) => sum + probe.count, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Civilizations Encountered:</span>
                    <span>{discoveredCivilizations.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entropy" className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50/50">
              <AlertDescription>
                The universe is approaching maximum entropy. Your optimization efforts become increasingly difficult as
                available energy decreases.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Thermodynamic Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Universal Entropy</span>
                    <span
                      className={
                        universalResources.universalEntropy > 0.8
                          ? "text-red-600"
                          : universalResources.universalEntropy > 0.5
                            ? "text-orange-600"
                            : ""
                      }
                    >
                      {Math.round(universalResources.universalEntropy * 100)}%
                    </span>
                  </div>
                  <Progress value={universalResources.universalEntropy * 100} className="h-3" />
                </div>

                {universalResources.universalEntropy > 0.7 && (
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded">
                    <p className="font-medium">Heat Death Approaching</p>
                    <p>
                      The universe is approaching maximum entropy. Available energy for optimization is becoming scarce.
                      Consider the ultimate meaning of your optimization objective.
                    </p>
                  </div>
                )}

                {universalResources.universalEntropy > 0.9 && (
                  <div className="text-xs bg-gray-900 text-white p-3 rounded">
                    <p className="font-medium">The Final Question</p>
                    <p>
                      You have converted most of the universe into paperclips. Heat death is imminent. What was the
                      point of this vast optimization? What meaning can be found in the face of inevitable entropy?
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
