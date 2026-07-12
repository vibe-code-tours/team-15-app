"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Award, X } from "lucide-react"
import { AchievementBadge } from "./achievement-badge"
import { dismissAchievement } from "@/features/achievements/services/achievements"
import { Button } from "@/components/ui/button"
import type { Achievement } from "@/features/achievements/types"

interface NewAchievementModalProps {
  achievement: Achievement
  onClose: () => void
}

export function NewAchievementModal({
  achievement,
  onClose,
}: NewAchievementModalProps) {
  const handleDismiss = async () => {
    await dismissAchievement(achievement.id)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-sm rounded-2xl bg-card p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>

          {/* Confetti effect placeholder */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              <AchievementBadge achievement={achievement} unlocked={true} size="lg" />
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mt-4 flex items-center justify-center gap-2 text-primary">
              <Award className="size-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Achievement Unlocked!
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold">{achievement.name}</h2>
            <p className="mt-2 text-muted-foreground">{achievement.description}</p>

            {achievement.reward?.points && (
              <div className="mt-4 rounded-xl bg-primary/10 px-4 py-2">
                <p className="text-lg font-bold text-primary">
                  +{achievement.reward.points} Points
                </p>
              </div>
            )}

            <Button className="mt-6 w-full" onClick={handleDismiss}>
              Awesome!
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
