export type AdminStats = {
  totalPickups: number
  completedPickups: number
  activeUsers: number
  totalItems: number
  totalCo2Saved: string
  recentPickups: Array<{
    id: number
    deviceName: string
    category: string
    status: string
    createdAt: string
    userName: string | null
  }>
}
