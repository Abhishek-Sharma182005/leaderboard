"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { fetchDailyProblem } from "@/lib/firebase/problems"

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  date: string
}

export function DailyProblem() {
  const { user } = useAuth()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const dailyProblem = await fetchDailyProblem()
        setProblem(dailyProblem)
      } catch (error) {
        console.error("Error fetching daily problem:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProblem()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-full mt-4" />
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No problem available today.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">{problem.title}</h3>
        <div className="flex gap-2 mt-1">
          <Badge
            variant={
              problem.difficulty === "Easy" ? "outline" : problem.difficulty === "Medium" ? "secondary" : "destructive"
            }
          >
            {problem.difficulty}
          </Badge>
          <Badge variant="outline">{problem.category}</Badge>
        </div>
      </div>

      {user ? (
        <Button asChild className="w-full">
          <Link href="/problems">
            Solve Problem <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="w-full">
          <Link href="/problems">
            View Problem <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}

