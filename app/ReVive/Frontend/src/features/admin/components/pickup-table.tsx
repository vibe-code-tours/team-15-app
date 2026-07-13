"use client"

import { useState } from "react"
import { Search, Eye, ChevronDown } from "lucide-react"
import { PickupStatusBadge } from "./pickup-status-badge"
import { PickupDetailModal } from "./pickup-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Pickup {
  id: number
  userId: string
  category: string
  deviceName: string
  quantity: number
  condition: string
  availableFrom: string
  availableTo: string
  timeSlot: string
  address: string
  notes: string | null
  status: string
  createdAt: string
  userName?: string
  userEmail?: string
}

export function PickupTable({ pickups }: { pickups: Pickup[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null)

  const filteredPickups = pickups.filter((pickup) => {
    const matchesSearch =
      pickup.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      pickup.category.toLowerCase().includes(search.toLowerCase()) ||
      pickup.userName?.toLowerCase().includes(search.toLowerCase()) ||
      pickup.userEmail?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || pickup.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pickups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full appearance-none items-center rounded-lg border border-border bg-background px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPickups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No pickups found.
                  </td>
                </tr>
              ) : (
                filteredPickups.map((pickup) => (
                  <tr key={pickup.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{pickup.deviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{pickup.category}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{pickup.userName || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{pickup.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(pickup.availableFrom).toLocaleDateString()} – {new Date(pickup.availableTo).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <PickupStatusBadge status={pickup.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPickup(pickup)}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPickup && (
        <PickupDetailModal
          pickup={selectedPickup}
          onClose={() => setSelectedPickup(null)}
        />
      )}
    </div>
  )
}
