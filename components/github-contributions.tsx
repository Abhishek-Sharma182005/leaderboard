"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGitHubContributions } from "@/lib/github/contributions"

export function GitHubContributions({ username }: { username: string }) {
  const [contributions, setContributions] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContributions = async () => {
      try {
        const svgData = await fetchGitHubContributions(username)
        setContributions(svgData)
      } catch (error) {
        console.error("Error fetching GitHub contributions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContributions()
  }, [username])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!contributions) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No GitHub contributions data available.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div dangerouslySetInnerHTML={{ __html: contributions }} />
    </div>
  )
}

