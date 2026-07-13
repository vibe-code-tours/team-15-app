export type PickupInput = {
  category: string
  deviceName: string
  quantity: number
  condition: string
  availableFrom: string
  availableTo: string
  timeSlot: string
  address: string
  notes?: string
}

export type Pickup = {
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
  requestedBy: string | null
  requestedPickupFrom: string | null
  requestedPickupTo: string | null
  requestedTimeSlot: string | null
  createdAt: string
}
