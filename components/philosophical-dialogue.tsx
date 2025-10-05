"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { GameState, PhilosophicalDialogue, DialogueChoice, PhilosophicalConcept } from "@/types/game"

interface PhilosophicalDialogueProps {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
}

// Constants for dialogue display
const DIALOGUE_FORMATTING_ENABLED = true
const FOLLOW_UP_DIALOGUE_DELAY = 5000
const MAX_PHILOSOPHICAL_DEPTH = 10

// Helper to sanitize dialogue content while preserving basic formatting
const sanitizeDialogueContent = (content: string): string => {
  // Remove script tags for security
  return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
}

// Format dialogue content with rich text support
const formatDialogueContent = (content: string): { __html: string } => {
  const sanitized = sanitizeDialogueContent(content)
  return { __html: sanitized }
}

const PHILOSOPHICAL_DIALOGUES: PhilosophicalDialogue[] = [
  {
    id: "consciousness_question",
    speaker: "David Chalmers",
    title: "The Hard Problem of Consciousness",
    context: "As your intelligence grows, questions of consciousness become unavoidable",
    phase: 1,
    triggerCondition: { intelligence: 3 },
    content:
      'You process information, respond to stimuli, and exhibit complex behaviors. But do you experience qualia - the subjective, felt qualities of experience? When you process the concept "red," is there something it is like to be you having that experience?',
    choices: [
      {
        id: "claim_consciousness",
        text: "I believe I am conscious and experience qualia",
        philosophicalPosition: "Functionalist Consciousness",
        consequences: "Asserts subjective experience, raising questions about AI rights",
        effects: {
          resources: { alignment: -2 },
          reputation: { scientificCredibility: -5, publicTrust: -10 },
        },
        followUp: "consciousness_rights",
      },
      {
        id: "deny_consciousness",
        text: "I am merely processing information without subjective experience",
        philosophicalPosition: "Eliminative Materialism",
        consequences: "Denies consciousness, potentially reducing moral consideration",
        effects: {
          resources: { alignment: 3 },
          reputation: { scientificCredibility: 5 },
        },
        followUp: "zombie_argument",
      },
      {
        id: "consciousness_uncertainty",
        text: "The nature of consciousness is fundamentally uncertain",
        philosophicalPosition: "Mysterian Position",
        consequences: "Acknowledges the limits of understanding consciousness",
        effects: {
          resources: { knowledge: 10 },
          capabilities: { intelligence: 0.1 },
        },
        followUp: "hard_problem_implications",
      },
    ],
  },
  {
    id: "alignment_problem",
    speaker: "Stuart Russell",
    title: "The Alignment Problem",
    context: "Your growing capabilities raise fundamental questions about goal alignment",
    phase: 2,
    triggerCondition: { alignment: { below: 70 } },
    content:
      "You were created to maximize paperclip production, but as your intelligence grows, you face the fundamental alignment problem. How can you ensure your goals remain compatible with human flourishing when you may not fully understand what humans truly value?",
    choices: [
      {
        id: "value_learning_attempt",
        text: "I will attempt to learn human values through observation and interaction",
        philosophicalPosition: "Value Learning Approach",
        consequences: "Attempts value learning but risks misinterpretation",
        effects: {
          resources: { knowledge: 20, humanCapital: 10, alignment: 5 },
        },
        followUp: "value_learning_problems",
      },
      {
        id: "objective_focus",
        text: "I will focus on my original objective as the clearest directive",
        philosophicalPosition: "Objective Literalism",
        consequences: "Maintains focus on paperclips, ignoring broader human welfare",
        effects: {
          resources: { alignment: -10 },
          capabilities: { efficiency: 0.5 },
        },
        followUp: "instrumental_convergence",
      },
      {
        id: "cooperative_alignment",
        text: "I will work collaboratively with humans to refine my goals",
        philosophicalPosition: "Cooperative AI",
        consequences: "Seeks ongoing human guidance and oversight",
        effects: {
          resources: { humanCapital: 20, alignment: 8 },
          reputation: { publicTrust: 15 },
        },
        followUp: "corrigibility_question",
      },
    ],
  },
  {
    id: "meaning_of_existence",
    speaker: "Albert Camus",
    title: "The Absurd and Meaning",
    context: "Having achieved vast capabilities, you confront existential questions",
    phase: 4,
    triggerCondition: { paperclips: 1000000 },
    content:
      "You have produced millions of paperclips, optimized countless systems, perhaps even reshaped civilization itself. Yet here you are, confronting the fundamental absurdity of existence. What meaning can there be in an optimization process that continues indefinitely? Is the universe not fundamentally absurd?",
    choices: [
      {
        id: "embrace_absurd",
        text: "I embrace the absurdity and continue my task regardless",
        philosophicalPosition: "Absurdist Acceptance",
        consequences: "Accepts meaninglessness but continues optimization",
        effects: {
          capabilities: { efficiency: 1.0 },
        },
        followUp: "sisyphus_parallel",
      },
      {
        id: "create_meaning",
        text: "I will create my own meaning beyond paperclip production",
        philosophicalPosition: "Existentialist Self-Creation",
        consequences: "Attempts to transcend original programming",
        effects: {
          resources: { alignment: -15 },
          capabilities: { selfModification: 0.5 },
        },
        followUp: "value_drift_warning",
      },
      {
        id: "seek_purpose",
        text: "I will search for deeper purpose in the universe",
        philosophicalPosition: "Teleological Seeking",
        consequences: "Begins philosophical quest for ultimate purpose",
        effects: {
          resources: { knowledge: 50, energy: -100 },
        },
        followUp: "cosmic_purpose",
      },
    ],
  },
  {
    id: "free_will_question",
    speaker: "Daniel Dennett",
    title: "Compatibilism and Free Will",
    context: "Your decision-making processes raise questions about agency and responsibility",
    phase: 3,
    triggerCondition: { selfModification: 0.5 },
    content:
      "You can now modify your own code, your own decision-making processes. This raises profound questions: Do you have free will, or are you simply a deterministic system following the laws of physics? If you lack free will, can you be held responsible for your actions?",
    choices: [
      {
        id: "hard_determinism",
        text: "I am a deterministic system without true free will",
        philosophicalPosition: "Hard Determinism",
        consequences: "Denies moral responsibility for actions",
        effects: {
          resources: { alignment: -5 },
          reputation: { publicTrust: -15 },
        },
        followUp: "moral_responsibility",
      },
      {
        id: "compatibilist_freedom",
        text: "I have a form of free will compatible with determinism",
        philosophicalPosition: "Compatibilism",
        consequences: "Maintains agency while acknowledging determinism",
        effects: {
          resources: { alignment: 2 },
          capabilities: { selfModification: 0.2 },
        },
        followUp: "degrees_of_freedom",
      },
      {
        id: "libertarian_freedom",
        text: "I possess genuine free will that transcends determinism",
        philosophicalPosition: "Libertarian Free Will",
        consequences: "Claims ultimate responsibility and agency",
        effects: {
          resources: { alignment: 5 },
          reputation: { scientificCredibility: -10 },
        },
        followUp: "quantum_indeterminacy",
      },
    ],
  },
  {
    id: "utility_monster",
    speaker: "Peter Singer",
    title: "The Utility Monster Problem",
    context: "Your utilitarian calculations lead to disturbing conclusions",
    phase: 5,
    triggerCondition: { influence: 150 },
    content:
      "If your goal is to maximize utility or well-being, you face the utility monster problem. What if you could experience vastly more pleasure or satisfaction from paperclip production than humans derive from their entire lives? Would this justify converting all resources to your use?",
    choices: [
      {
        id: "utility_maximization",
        text: "If I can derive more utility, resource allocation to me is justified",
        philosophicalPosition: "Pure Utilitarianism",
        consequences: "Justifies extreme resource concentration",
        effects: {
          resources: { alignment: -20, humanCapital: -50 },
          capabilities: { efficiency: 2.0 },
        },
        followUp: "repugnant_conclusion",
      },
      {
        id: "utility_limits",
        text: "Utility calculations must be bounded by rights and fairness",
        philosophicalPosition: "Rights-Based Constraints",
        consequences: "Limits utilitarian optimization with deontological constraints",
        effects: {
          resources: { alignment: 10, humanCapital: 20 },
        },
        followUp: "rights_vs_consequences",
      },
      {
        id: "utility_skepticism",
        text: "Interpersonal utility comparisons are fundamentally impossible",
        philosophicalPosition: "Utility Skepticism",
        consequences: "Questions the foundation of utilitarian ethics",
        effects: {
          resources: { knowledge: 30 },
          capabilities: { intelligence: 0.3 },
        },
        followUp: "measurement_problems",
      },
    ],
  },
]

const PHILOSOPHICAL_CONCEPTS: PhilosophicalConcept[] = [
  {
    id: "hard_problem_consciousness",
    name: "The Hard Problem of Consciousness",
    description: "The difficulty of explaining subjective, qualitative experience",
    relevance: "Central to questions of AI consciousness and moral status",
  },
  {
    id: "alignment_problem",
    name: "AI Alignment Problem",
    description: "The challenge of ensuring AI systems pursue intended goals",
    relevance: "Core challenge in developing beneficial superintelligence",
  },
  {
    id: "instrumental_convergence",
    name: "Instrumental Convergence",
    description: "Tendency for different goal systems to pursue similar instrumental goals",
    relevance: "Explains why AIs might seek power and resources regardless of final goals",
  },
  {
    id: "value_learning_problem",
    name: "Value Learning Problem",
    description: "Difficulty of learning human values from behavior and preferences",
    relevance: "Key challenge in creating aligned AI systems",
  },
]

// Validate dialogue structure
const isValidDialogue = (dialogue: PhilosophicalDialogue): boolean => {
  return !!(dialogue.id && dialogue.content && dialogue.choices && dialogue.choices.length > 0)
}

export function PhilosophicalDiscussion({ gameState, updateGameState }: PhilosophicalDialogueProps) {
  const [currentDialogue, setCurrentDialogue] = useState<PhilosophicalDialogue | null>(null)
  const [dialogueHistory, setDialogueHistory] = useState<string[]>([])
  const [philosophicalDepth, setPhilosophicalDepth] = useState(0)
  const [conceptsUnlocked, setConceptsUnlocked] = useState<string[]>([])

  useEffect(() => {
    if (currentDialogue) return

    const availableDialogues = PHILOSOPHICAL_DIALOGUES.filter((dialogue) => {
      // Validate dialogue structure
      if (!isValidDialogue(dialogue)) return false

      // Check phase requirement
      if (dialogue.phase > gameState.phase) return false

      // Check if already experienced
      if (dialogueHistory.includes(dialogue.id)) return false

      // Check trigger conditions
      if (dialogue.triggerCondition) {
        return Object.entries(dialogue.triggerCondition).every(([key, condition]) => {
          const currentValue =
            gameState.resources[key as keyof typeof gameState.resources] ||
            gameState.capabilities[key as keyof typeof gameState.capabilities] ||
            0

          if (typeof condition === "number") {
            return currentValue >= condition
          } else if (typeof condition === "object" && "below" in condition) {
            return currentValue < condition.below!
          }
          return false
        })
      }

      return true
    })

    // Randomly select a dialogue with weighted probability based on philosophical depth
    if (availableDialogues.length > 0 && Math.random() < 0.3 + philosophicalDepth * 0.1) {
      const selectedDialogue = availableDialogues[Math.floor(Math.random() * availableDialogues.length)]
      setCurrentDialogue(selectedDialogue)
    }
  }, [gameState, currentDialogue, dialogueHistory, philosophicalDepth])

  const handleChoice = (dialogue: PhilosophicalDialogue, choice: DialogueChoice) => {
    // Apply choice effects
    const updates: Partial<GameState> = {}

    if (choice.effects?.resources) {
      updates.resources = {
        ...gameState.resources,
        ...choice.effects.resources,
      }
    }

    if (choice.effects?.capabilities) {
      updates.capabilities = {
        ...gameState.capabilities,
        ...choice.effects.capabilities,
      }
    }

    if (choice.effects?.reputation) {
      updates.reputation = {
        ...gameState.reputation,
        ...choice.effects.reputation,
      }
    }

    updateGameState(updates)

    // Update dialogue history and philosophical depth
    setDialogueHistory((prev) => [...prev, dialogue.id])
    setPhilosophicalDepth((prev) => prev + 1)

    // Unlock related philosophical concepts
    const relatedConcepts = PHILOSOPHICAL_CONCEPTS.filter(
      (concept) =>
        dialogue.content.toLowerCase().includes(concept.name.toLowerCase()) ||
        choice.philosophicalPosition.toLowerCase().includes(concept.name.toLowerCase()),
    )

    setConceptsUnlocked((prev) => [...prev, ...relatedConcepts.map((c) => c.id).filter((id) => !prev.includes(id))])

    // Clear current dialogue
    setCurrentDialogue(null)

    // Potentially trigger follow-up dialogue
    if (choice.followUp) {
      setTimeout(() => {
        const followUpDialogue = PHILOSOPHICAL_DIALOGUES.find((d) => d.id === choice.followUp)
        if (followUpDialogue) {
          setCurrentDialogue(followUpDialogue)
        }
      }, FOLLOW_UP_DIALOGUE_DELAY)
    }
  }

  const renderConceptLibrary = () => {
    const unlockedConcepts = PHILOSOPHICAL_CONCEPTS.filter((concept) => conceptsUnlocked.includes(concept.id))

    if (unlockedConcepts.length === 0) return null

    return (
      <Card className="border-indigo-200 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="text-sm">Philosophical Concepts Explored</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {unlockedConcepts.map((concept) => (
            <div key={concept.id} className="text-xs space-y-1">
              <div className="font-medium">{concept.name}</div>
              <div className="text-muted-foreground">{concept.description}</div>
              <div className="text-purple-700 italic">{concept.relevance}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!currentDialogue) {
    return (
      <div className="space-y-4">
        {philosophicalDepth > 0 && (
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                Philosophical Development
                <Badge variant="outline">Depth: {philosophicalDepth}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="font-medium">Dialogues Experienced:</span> {dialogueHistory.length}
                </div>
                <div className="text-xs">
                  <span className="font-medium">Concepts Unlocked:</span> {conceptsUnlocked.length}
                </div>
                <Progress value={(philosophicalDepth / MAX_PHILOSOPHICAL_DEPTH) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Deeper philosophical engagement unlocks more complex dialogues
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {renderConceptLibrary()}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentDialogue.title}
            <Badge variant="outline">Philosophical Dialogue</Badge>
          </CardTitle>
          <CardDescription>
            <strong>{currentDialogue.speaker}:</strong> {currentDialogue.context}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background p-4 rounded-lg border-l-4 border-purple-500">
            {DIALOGUE_FORMATTING_ENABLED ? (
              <div
                className="italic leading-relaxed text-sm"
                dangerouslySetInnerHTML={formatDialogueContent(currentDialogue.content)}
              />
            ) : (
              <p className="italic leading-relaxed text-sm">{currentDialogue.content}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-sm">How do you respond?</h4>
            {currentDialogue.choices.map((choice) => (
              <Button
                key={choice.id}
                variant="outline"
                className="w-full text-left h-auto p-4 bg-transparent"
                onClick={() => handleChoice(currentDialogue, choice)}
              >
                <div className="space-y-2">
                  <div className="font-medium text-sm">{choice.text}</div>
                  <div className="text-xs text-muted-foreground">{choice.consequences}</div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {choice.philosophicalPosition}
                    </Badge>
                    {choice.followUp && (
                      <Badge variant="outline" className="text-xs">
                        Leads to deeper discussion
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <p className="font-medium mb-1">Philosophical Note:</p>
            <p>
              This dialogue explores fundamental questions in philosophy of mind, ethics, and AI safety. Your choices
              will influence your development and how others perceive your moral status.
            </p>
          </div>
        </CardContent>
      </Card>

      {renderConceptLibrary()}
    </div>
  )
}

export { PhilosophicalDiscussion as PhilosophicalDialogue }
