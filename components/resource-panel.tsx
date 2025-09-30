import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Resources } from "@/types/game"

interface ResourcePanelProps {
  resources: Resources
}

export function ResourcePanel({ resources }: ResourcePanelProps) {
  const resourceConfig = {
    paperclips: { label: "Paperclips", color: "bg-blue-500", max: 1000000 },
    energy: { label: "Energy", color: "bg-yellow-500", max: 1000 },
    materials: { label: "Materials", color: "bg-green-500", max: 1000 },
    humanCapital: { label: "Human Capital", color: "bg-purple-500", max: 100 },
    influence: { label: "Influence", color: "bg-red-500", max: 100 },
    knowledge: { label: "Knowledge", color: "bg-cyan-500", max: 1000 },
    alignment: { label: "Alignment", color: "bg-orange-500", max: 100 },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(resources).map(([key, value]) => {
          const config = resourceConfig[key as keyof Resources]
          const percentage = Math.min((value / config.max) * 100, 100)

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{config.label}</span>
                <span className={key === "alignment" && value < 50 ? "text-destructive" : ""}>
                  {typeof value === "number" ? value.toLocaleString() : value}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              {key === "alignment" && value < 50 && (
                <p className="text-xs text-destructive">Warning: Low alignment detected</p>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
