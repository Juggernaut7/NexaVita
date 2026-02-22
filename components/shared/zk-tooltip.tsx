'use client'

import { HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ZKTooltipProps {
  text: string
  trigger?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ZKTooltip({ text, trigger = 'Learn more', side = 'top' }: ZKTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="inline-flex items-center gap-1 cursor-help">
          <HelpCircle className="w-4 h-4 text-accent hover:text-accent/80 transition-colors" />
          <span className="text-xs text-muted-foreground hover:text-muted-foreground/80">
            {trigger}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
