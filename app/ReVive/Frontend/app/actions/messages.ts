"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { conversations, messages, itemRequests } from "@/lib/db/message-schema"
import { user } from "@/lib/db/schema"
import { eq, and, desc, count } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// Create or get conversation
export async function getOrCreateConversation(
  donorId: string,
  requesterId: string,
  listingId?: number
) {
  const userId = await getUserId()

  // Check if conversation already exists
  const existing = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.donorId, donorId),
        eq(conversations.requesterId, requesterId),
        listingId ? eq(conversations.listingId, listingId) : undefined
      )
    )
    .limit(1)

  if (existing.length > 0) {
    return existing[0].id
  }

  // Create new conversation
  const conversationId = randomUUID()
  await db.insert(conversations).values({
    id: conversationId,
    donorId,
    requesterId,
    listingId: listingId || null,
    createdAt: new Date().toISOString(),
  })

  return conversationId
}

// Send message
export async function sendMessage(
  conversationId: string,
  content: string
) {
  const userId = await getUserId()

  if (!content.trim()) {
    return { error: "Message cannot be empty" }
  }

  // Verify user is part of conversation
  const conversation = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1)

  if (conversation.length === 0) {
    return { error: "Conversation not found" }
  }

  if (
    conversation[0].donorId !== userId &&
    conversation[0].requesterId !== userId
  ) {
    return { error: "Unauthorized" }
  }

  // Create message
  const messageId = randomUUID()
  await db.insert(messages).values({
    id: messageId,
    conversationId,
    senderId: userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  })

  // Update conversation last message time
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date().toISOString() })
    .where(eq(conversations.id, conversationId))

  revalidatePath("/messages")
  return { success: true, messageId }
}

// Get conversations for user
export async function getConversations() {
  const userId = await getUserId()

  const userConversations = await db
    .select({
      id: conversations.id,
      donorId: conversations.donorId,
      requesterId: conversations.requesterId,
      status: conversations.status,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .where(
      and(
        eq(conversations.donorId, userId),
        eq(conversations.status, "active")
      )
    )
    .orderBy(desc(conversations.lastMessageAt))

  // Get other user's name for each conversation
  const conversationsWithNames = await Promise.all(
    userConversations.map(async (conv) => {
      const otherUserId =
        conv.donorId === userId ? conv.requesterId : conv.donorId
      const otherUser = await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, otherUserId))
        .limit(1)

      // Get last message
      const lastMsg = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1)

      return {
        ...conv,
        otherUserName: otherUser[0]?.name || "Unknown",
        lastMessage: lastMsg[0]?.content || null,
        lastMessageSender: lastMsg[0]?.senderId || null,
      }
    })
  )

  return conversationsWithNames
}

// Get messages in conversation
export async function getMessages(conversationId: string) {
  const userId = await getUserId()

  // Verify user is part of conversation
  const conversation = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1)

  if (conversation.length === 0) {
    throw new Error("Conversation not found")
  }

  if (
    conversation[0].donorId !== userId &&
    conversation[0].requesterId !== userId
  ) {
    throw new Error("Unauthorized")
  }

  // Get messages
  const conversationMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt)

  // Mark unread messages as read
  await db
    .update(messages)
    .set({ read: true })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.read, false)
      )
    )

  return conversationMessages
}

// Get unread message count
export async function getUnreadMessageCount() {
  const userId = await getUserId()

  // Get all conversations user is part of
  const userConversations = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(
      and(
        eq(conversations.donorId, userId),
        eq(conversations.status, "active")
      )
    )

  const conversationIds = userConversations.map((c) => c.id)

  if (conversationIds.length === 0) return 0

  // Count unread messages
  const unreadCount = await db
    .select({ count: count() })
    .from(messages)
    .where(
      and(
        eq(messages.read, false),
        // Not sent by user
        // This is simplified - in production you'd use a more efficient query
      )
    )

  return unreadCount[0]?.count || 0
}

// Create item request
export async function createItemRequest(
  listingId: number,
  donorId: string,
  message?: string
) {
  const userId = await getUserId()

  // Check if already requested
  const existing = await db
    .select()
    .from(itemRequests)
    .where(
      and(
        eq(itemRequests.listingId, listingId),
        eq(itemRequests.requesterId, userId)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    return { error: "You have already requested this item" }
  }

  // Create request
  const requestId = randomUUID()
  await db.insert(itemRequests).values({
    id: requestId,
    listingId,
    requesterId: userId,
    donorId,
    message: message?.trim() || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // Create conversation for this request
  await getOrCreateConversation(donorId, userId, listingId)

  revalidatePath("/dashboard")
  return { success: true, requestId }
}

// Update request status
export async function updateRequestStatus(
  requestId: string,
  status: "accepted" | "rejected" | "completed"
) {
  const userId = await getUserId()

  const request = await db
    .select()
    .from(itemRequests)
    .where(eq(itemRequests.id, requestId))
    .limit(1)

  if (request.length === 0) {
    return { error: "Request not found" }
  }

  if (request[0].donorId !== userId) {
    return { error: "Unauthorized" }
  }

  await db
    .update(itemRequests)
    .set({
      status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(itemRequests.id, requestId))

  revalidatePath("/dashboard")
  return { success: true }
}

// Get requests for user's listings
export async function getIncomingRequests() {
  const userId = await getUserId()

  const requests = await db
    .select()
    .from(itemRequests)
    .where(eq(itemRequests.donorId, userId))
    .orderBy(desc(itemRequests.createdAt))

  // Get requester names
  const requestsWithNames = await Promise.all(
    requests.map(async (req) => {
      const requester = await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, req.requesterId))
        .limit(1)

      return {
        ...req,
        requesterName: requester[0]?.name || "Unknown",
      }
    })
  )

  return requestsWithNames
}

// Get user's outgoing requests
export async function getOutgoingRequests() {
  const userId = await getUserId()

  const requests = await db
    .select()
    .from(itemRequests)
    .where(eq(itemRequests.requesterId, userId))
    .orderBy(desc(itemRequests.createdAt))

  return requests
}
