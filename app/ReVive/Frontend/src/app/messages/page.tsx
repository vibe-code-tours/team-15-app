"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { apiGet } from "@/lib/api/client"
import { User } from "lucide-react"

type UserProfile = {
  id: string
  name: string
  image: string | null
}

export default function MessagesPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await apiGet<UserProfile[]>("/api/users")
        setUsers(data)
      } catch (err) {
        console.error("Failed to fetch users", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
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
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted border border-border">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="size-full rounded-full object-cover" />
                    ) : (
                      <User className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">Click to message...</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/20">
          {selectedUser ? (
            <div className="text-center space-y-4">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted border border-border mx-auto">
                {selectedUser.image ? (
                  <img src={selectedUser.image} alt={selectedUser.name} className="size-full rounded-full object-cover" />
                ) : (
                  <User className="size-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">Chat with {selectedUser.name}</h3>
                <p className="text-muted-foreground mt-2">
                  WebSocket Real-Time Messaging implementation coming soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground">Select a conversation to start messaging</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
