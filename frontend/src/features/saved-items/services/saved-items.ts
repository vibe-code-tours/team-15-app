"use server"

// Saved items functionality not yet available in Backend API
// Stub implementations to prevent import errors

export async function saveItem(listingId: number) {
  return { success: true }
}

export async function unsaveItem(listingId: number) {
  return { success: true }
}

export async function isItemSaved(listingId: number): Promise<boolean> {
  return false
}

export async function getSavedItems() {
  return []
}
