import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

interface ProgressWithLabelProps {
  label: string
  value: number
  max?: number
  isLoading?: boolean
  sublabel?: string
}

export function ProgressWithLabel({
  label,
  value,
  max = 100,
  isLoading = false,
  sublabel,
}: ProgressWithLabelProps) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
          {label}
        </label>
        <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  )
}
