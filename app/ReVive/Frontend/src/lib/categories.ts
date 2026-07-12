export const PICKUP_CATEGORIES = [
  { value: "phones", label: "Phones & Tablets" },
  { value: "computers", label: "Computers" },
  { value: "cables", label: "Cables & Chargers" },
  { value: "home", label: "Home Electronics" },
  { value: "batteries", label: "Batteries" },
  { value: "appliances", label: "Appliances" },
] as const

export const CONDITIONS = [
  { value: "working", label: "Working" },
  { value: "partial", label: "Partially working" },
  { value: "broken", label: "Not working / broken" },
] as const

export const TIME_SLOTS = [
  { value: "morning", label: "Morning (8am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 4pm)" },
  { value: "evening", label: "Evening (4pm – 8pm)" },
] as const

export function categoryLabel(value: string) {
  return PICKUP_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function conditionLabel(value: string) {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value
}

export function timeSlotLabel(value: string) {
  return TIME_SLOTS.find((t) => t.value === value)?.label ?? value
}
