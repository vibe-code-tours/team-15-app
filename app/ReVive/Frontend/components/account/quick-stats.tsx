import { Package, Award, Users, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface QuickStatsProps {
  stats: {
    totalPickups: number
    totalPoints: number
    totalReferrals: number
    achievementsUnlocked: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      label: "Total Listings",
      value: stats.totalPickups,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Impact Points",
      value: stats.totalPoints,
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Referrals",
      value: stats.totalReferrals,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Achievements",
      value: stats.achievementsUnlocked,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`flex size-10 items-center justify-center rounded-xl ${item.bgColor}`}>
              <item.icon className={`size-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
