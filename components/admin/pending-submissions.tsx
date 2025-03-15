"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Github, XCircle } from "lucide-react"
import { fetchPendingSubmissions, approveSubmission, rejectSubmission } from "@/lib/firebase/admin"

interface Submission {
  id: string
  userId: string
  username: string
  photoURL?: string
  problemId: string
  problemTitle: string
  date: string
  pullRequestUrl: string
}

export function PendingSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const submissionsData = await fetchPendingSubmissions()
        setSubmissions(submissionsData)
      } catch (error) {
        console.error("Error fetching pending submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [])

  const handleApprove = async (submissionId: string, isOptimized = false) => {
    setProcessing((prev) => ({ ...prev, [submissionId]: true }))
    try {
      await approveSubmission(submissionId, isOptimized)
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
    } catch (error) {
      console.error("Error approving submission:", error)
    } finally {
      setProcessing((prev) => ({ ...prev, [submissionId]: false }))
    }
  }

  const handleReject = async (submissionId: string, isPlagiarized = false) => {
    setProcessing((prev) => ({ ...prev, [submissionId]: true }))
    try {
      await rejectSubmission(submissionId, isPlagiarized)
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
    } catch (error) {
      console.error("Error rejecting submission:", error)
    } finally {
      setProcessing((prev) => ({ ...prev, [submissionId]: false }))
    }
  }

  if (loading) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>PR</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-full" />
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
        <p className="text-muted-foreground">No pending submissions.</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>PR</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={submission.photoURL || `/placeholder.svg?height=32&width=32`}
                      alt={submission.username}
                    />
                    <AvatarFallback>{submission.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{submission.username}</span>
                </div>
              </TableCell>
              <TableCell>{submission.problemTitle}</TableCell>
              <TableCell>{submission.date}</TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <a href={submission.pullRequestUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1 h-4 w-4" /> View PR
                  </a>
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleReject(submission.id)}
                    disabled={processing[submission.id]}
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-700 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleReject(submission.id, true)}
                    disabled={processing[submission.id]}
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Plagiarized
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    onClick={() => handleApprove(submission.id)}
                    disabled={processing[submission.id]}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-700 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-950"
                    onClick={() => handleApprove(submission.id, true)}
                    disabled={processing[submission.id]}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> Optimized
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

