"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { apiGet } from "@/lib/api/client"
import { User } from "lucide-react"
import { ChatRoom } from "./chat-room"

type UserProfile = {
  id: string
  name: string
  image: string | null
}

export function MessagesView({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await apiGet<UserProfile[]>("/api/users")
        // Filter out current user from the list
        setUsers(data.filter(u => u.id !== currentUser.id))
      } catch (err) {
        console.error("Failed to fetch users", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentUser.id])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader userName={currentUser.name} />
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Users List */}
        <div className="w-80 border-r border-border/60 bg-card/50 overflow-y-auto">
          <div className="p-4 border-b border-border/60">
            <h2 className="font-semibold text-lg">Messages</h2>
            <p className="text-sm text-muted-foreground">Select a user to chat</p>
          </div>
          
          <div className="flex flex-col p-2 gap-1">
            {loading ? (
              <p className="p-4 text-sm text-muted-foreground text-center">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">No users found.</p>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="size-full rounded-full object-cover" />
                    ) : (
                      <User className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">Click to message...</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className="flex-1 flex flex-col bg-muted/10 relative overflow-hidden">
          {selectedUser ? (
            <ChatRoom currentUser={currentUser} selectedUser={selectedUser} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted border border-border mb-4">
                <User className="size-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Your Messages</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                Select a conversation from the sidebar to start chatting with other users.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
