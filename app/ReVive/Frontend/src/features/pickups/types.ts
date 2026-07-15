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

export type PickupRequest = {
  id: number
  pickupId: number
  requesterId: string
  pickupFrom: string | null
  pickupTo: string | null
  timeSlot: string | null
  status: string
  createdAt: string
  requester?: {
    id: string
    name: string
    email: string
  } | null
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
  images: string[] | null
  status: string
  createdAt: string
  requests?: PickupRequest[]
  request?: PickupRequest
}
