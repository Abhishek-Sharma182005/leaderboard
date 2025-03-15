"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { fetchProblems } from "@/lib/firebase/problems"
import { useAuth } from "@/lib/hooks/use-auth"

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  date: string
  solved?: boolean
}

export function ProblemList({ filter = "week" }: { filter?: "week" | "archive" }) {
  const { user } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const problemsData = await fetchProblems(filter, user?.uid)
        setProblems(problemsData)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProblems()
  }, [filter, user?.uid])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No problems available for this period.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {problems.map((problem) => (
        <Card key={problem.id} className={problem.solved ? "border-green-200 dark:border-green-900" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {problem.title}
              {problem.solved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{problem.date}</p>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex gap-2">
              <Badge
                variant={
                  problem.difficulty === "Easy"
                    ? "outline"
                    : problem.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                }
              >
                {problem.difficulty}
              </Badge>
              <Badge variant="outline">{problem.category}</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant={problem.solved ? "outline" : "default"} className="w-full">
              <Link href={`/problems/${problem.id}`}>
                {problem.solved ? "View Solution" : "Solve Problem"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

