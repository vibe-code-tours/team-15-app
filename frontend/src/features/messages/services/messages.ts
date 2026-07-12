"use server"

// Messages functionality not yet available in Backend API
// Stub implementations to prevent import errors

export async function getOrCreateConversation(
  donorId: string,
  requesterId: string,
  listingId?: number
) {
  return { id: "stub-conversation", donorId, requesterId, listingId }
}

export async function sendMessage(conversationId: string, content: string) {
  return { success: true }
}

export async function getConversations() {
  return []
}

export async function getMessages(conversationId: string) {
  return []
}

export async function getUnreadMessageCount(): Promise<number> {
  return 0
}

export async function createItemRequest(
  listingId: number,
  donorId: string,
  message?: string
) {
  return { success: true }
}

export async function updateRequestStatus(
  requestId: string,
  status: "accepted" | "rejected" | "completed"
) {
  return { success: true }
}

export async function getIncomingRequests() {
  return []
}

export async function getOutgoingRequests() {
  return []
}
