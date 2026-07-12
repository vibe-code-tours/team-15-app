"use client"

import { motion } from "framer-motion"
import { TIER_COLORS } from "@/features/achievements/types"
import type { Achievement, AchievementTier } from "@/features/achievements/types"

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked: boolean
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

const SIZE_CLASSES = {
  sm: "size-12 text-xl",
  md: "size-16 text-2xl",
  lg: "size-20 text-3xl",
}

const TIER_RING: Record<AchievementTier, string> = {
  bronze: "ring-2 ring-orange-500/50",
  silver: "ring-2 ring-gray-400/50",
  gold: "ring-2 ring-yellow-500/50",
  platinum: "ring-2 ring-purple-500/50",
}

export function AchievementBadge({
  achievement,
  unlocked,
  size = "md",
  showTooltip = true,
}: AchievementBadgeProps) {
  return (
    <motion.div
      className="relative group"
      whileHover={unlocked ? { scale: 1.1 } : undefined}
    >
      <div
        className={`
          ${SIZE_CLASSES[size]}
          flex items-center justify-center rounded-full
          ${
            unlocked
              ? `${TIER_COLORS[achievement.tier]} ${TIER_RING[achievement.tier]}`
              : "bg-muted text-muted-foreground/30 grayscale"
          }
          transition-all duration-200
        `}
      >
        {achievement.icon}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <p className="font-semibold text-sm">{achievement.name}</p>
            <p className="text-xs text-muted-foreground">
              {achievement.description}
            </p>
            {!unlocked && (
              <p className="text-xs text-primary mt-1">
                {achievement.reward?.points} points
              </p>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-card" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
