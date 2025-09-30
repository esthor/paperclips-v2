import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Phase, GameState } from "@/types/game"

interface PhaseDisplayProps {
  phase: Phase
  gameState: GameState
}

export function PhaseDisplay({ phase, gameState }: PhaseDisplayProps) {
  const calculatePhaseProgress = () => {
    const thresholds = Object.entries(phase.unlockThreshold)
    if (thresholds.length === 0) return 100

    const progress = thresholds.map(([resource, threshold]) => {
      const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
      return Math.min((current / threshold) * 100, 100)
    })

    return progress.reduce((sum, p) => sum + p, 0) / progress.length
  }

  const progress = calculatePhaseProgress()

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{phase.name}</CardTitle>
            <CardDescription className="text-lg">{phase.subtitle}</CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            Phase {phase.id + 1}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{phase.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Phase Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {progress < 100 && (
          <div className="text-xs text-muted-foreground">
            <p>Requirements for next phase:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {Object.entries(phase.unlockThreshold).map(([resource, threshold]) => (
                <li key={resource}>
                  {resource}: {threshold.toLocaleString()}
                  (current: {(gameState.resources[resource as keyof typeof gameState.resources] || 0).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
