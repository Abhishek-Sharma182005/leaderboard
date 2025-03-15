"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Award, Calendar, Code, FlameIcon as Fire, Github, Star, Zap } from "lucide-react"
import { fetchUserBadges } from "@/lib/firebase/users"

interface Badge {
  id: string
  name: string
  description: string
  icon: "streak" | "problems" | "optimization" | "contribution" | "social" | "achievement"
  earned: boolean
  date?: string
}

export function UserBadges({ username }: { username: string }) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const badgesData = await fetchUserBadges(username)
        setBadges(badgesData)
      } catch (error) {
        console.error("Error fetching user badges:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBadges()
  }, [username])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "streak":
        return <Fire className="h-6 w-6" />
      case "problems":
        return <Code className="h-6 w-6" />
      case "optimization":
        return <Zap className="h-6 w-6" />
      case "contribution":
        return <Github className="h-6 w-6" />
      case "social":
        return <Calendar className="h-6 w-6" />
      case "achievement":
        return <Award className="h-6 w-6" />
      default:
        return <Star className="h-6 w-6" />
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <TooltipProvider>
        {badges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <div
                className={`flex aspect-square items-center justify-center rounded-md border ${
                  badge.earned
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-transparent opacity-40"
                }`}
              >
                {getIcon(badge.icon)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="text-center">
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                {badge.earned && badge.date && <p className="text-xs mt-1">Earned on {badge.date}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

