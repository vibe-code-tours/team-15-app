export type PickupInput = {
  category: string
  deviceName: string
  quantity: number
  condition: string
  pickupDate: string
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
  pickupDate: string
  timeSlot: string
  address: string
  notes: string | null
  status: string
  createdAt: string
}
