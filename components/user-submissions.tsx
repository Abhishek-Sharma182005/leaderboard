"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Github, XCircle } from "lucide-react"
import Link from "next/link"
import { fetchUserSubmissions } from "@/lib/firebase/submissions"

interface Submission {
  id: string
  problemId: string
  problemTitle: string
  date: string
  status: "accepted" | "rejected" | "pending"
  points: number
  pullRequestUrl: string
}

export function UserSubmissions({ username }: { username: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const submissionsData = await fetchUserSubmissions(username)
        setSubmissions(submissionsData)
      } catch (error) {
        console.error("Error fetching user submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [username])

  if (loading) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-10 ml-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No submissions yet.</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <Link href={`/problems/${submission.problemId}`} className="font-medium hover:underline">
                  {submission.problemTitle}
                </Link>
              </TableCell>
              <TableCell>{submission.date}</TableCell>
              <TableCell>
                {submission.status === "accepted" ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Accepted
                  </Badge>
                ) : submission.status === "rejected" ? (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" /> Rejected
                  </Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {submission.points > 0 ? `+${submission.points}` : submission.points}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <a href={submission.pullRequestUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1 h-4 w-4" /> View PR
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

