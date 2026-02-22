import { LucideIcon, Lock, Activity, Moon, Heart, TrendingUp } from 'lucide-react'

interface PrivacyBadgeProps {
  category: 'fitness' | 'sleep' | 'wellness' | 'recovery'
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

const categoryConfig: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  fitness: { icon: Activity, label: 'Fitness Cohort', color: 'text-blue-400' },
  sleep: { icon: Moon, label: 'Sleep Analytics', color: 'text-indigo-400' },
  wellness: { icon: Heart, label: 'Wellness Profile', color: 'text-emerald-400' },
  recovery: { icon: TrendingUp, label: 'Recovery Metrics', color: 'text-cyan-400' },
}

export function PrivacyBadge({
  category,
  description = '',
  size = 'md',
}: PrivacyBadgeProps) {
  const config = categoryConfig[category]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2
        ${sizeClasses[size]}
        bg-card border border-border rounded-lg
        backdrop-blur-md bg-black/30 border-white/10
      `}
    >
      <Icon className={`${iconSizes[size]} ${config.color}`} />
      <div className="flex flex-col">
        <span className="font-semibold text-foreground">{config.label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <Lock className={`${iconSizes[size]} ${config.color} ml-auto`} />
    </div>
  )
}
