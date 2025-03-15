"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { fetchLeaderboardPreview } from "@/lib/firebase/leaderboard"

interface LeaderboardEntry {
  id: string
  username: string
  photoURL?: string
  points: number
  rank: number
  isTechtronica: boolean
}

export function LeaderboardPreview() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const leaderboardData = await fetchLeaderboardPreview()
        setEntries(leaderboardData)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-6 w-10" />
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No entries yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/profile/${entry.username}`}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
        >
          <div className="font-medium text-sm w-5 text-center">{entry.rank}</div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={entry.photoURL || `/placeholder.svg?height=32&width=32`} alt={entry.username} />
            <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{entry.username}</p>
              {entry.isTechtronica && (
                <Badge variant="outline" className="text-xs">
                  Techtronica
                </Badge>
              )}
            </div>
          </div>
          <div className="font-medium">{entry.points} pts</div>
        </Link>
      ))}

      <div className="pt-2">
        <Link href="/leaderboard" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          View full leaderboard →
        </Link>
      </div>
    </div>
  )
}

