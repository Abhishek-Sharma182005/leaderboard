"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchUserStats } from "@/lib/firebase/users"

interface UserStats {
  totalPoints: number
  problemsSolved: number
  currentStreak: number
  longestStreak: number
  rank: number
  socialShares: number
}

export function UserStats({ username }: { username: string }) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await fetchUserStats(username)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [username])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No stats available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Points</span>
        <span className="font-medium">{stats.totalPoints}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Problems Solved</span>
        <span className="font-medium">{stats.problemsSolved}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Current Streak</span>
        <span className="font-medium">{stats.currentStreak} days</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Longest Streak</span>
        <span className="font-medium">{stats.longestStreak} days</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Current Rank</span>
        <span className="font-medium">#{stats.rank}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Social Shares</span>
        <span className="font-medium">{stats.socialShares}</span>
      </div>
    </div>
  )
}

