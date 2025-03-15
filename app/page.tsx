import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DailyProblem } from "@/components/daily-problem"
import { LeaderboardPreview } from "@/components/leaderboard-preview"

export default function Home() {
  return (
    <div className="container py-10 space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">CodeQuest Challenge</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Solve daily DSA problems, earn points, and compete on the leaderboard. Track your progress and earn badges for
          your achievements.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/problems">View Today's Problem</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Daily Problem</CardTitle>
            <CardDescription>Today's coding challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyProblem />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top performers this week</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardPreview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Scoring system</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-medium">+2 points</span>
                <span>Per correct submission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">+1 point</span>
                <span>For well-documented & optimized code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">+0.5 points</span>
                <span>Per social media post with #TechtronicaCodeChallenge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">+3 points</span>
                <span>For a full-week streak (solving all 7 problems)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">-5 points</span>
                <span>Penalty for copied/plagiarized code</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

