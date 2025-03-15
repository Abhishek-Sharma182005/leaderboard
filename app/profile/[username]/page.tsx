import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserSubmissions } from "@/components/user-submissions"
import { UserBadges } from "@/components/user-badges"
import { UserStats } from "@/components/user-stats"
import { GitHubContributions } from "@/components/github-contributions"
import { CalendarDays, Github, Linkedin, Twitter } from "lucide-react"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const username = params.username

  return (
    <div className="container py-10 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={username} />
                  <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{username}</CardTitle>
                  <CardDescription>Joined January 2025</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>14-day streak</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  <span>42 submissions</span>
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <UserStats username={username} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Achievements unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <UserBadges username={username} />
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3 space-y-6">
          <Tabs defaultValue="submissions">
            <TabsList>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="contributions">GitHub Contributions</TabsTrigger>
            </TabsList>
            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle>Submission History</CardTitle>
                  <CardDescription>All problems solved by {username}</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserSubmissions username={username} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contributions">
              <Card>
                <CardHeader>
                  <CardTitle>GitHub Contributions</CardTitle>
                  <CardDescription>Activity on GitHub</CardDescription>
                </CardHeader>
                <CardContent>
                  <GitHubContributions username={username} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

