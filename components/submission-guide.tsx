import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export function SubmissionGuide() {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>How to submit your solution</AlertTitle>
        <AlertDescription>
          Submit your solution by creating a pull request to the CodeQuest repository. Make sure to follow the
          submission guidelines to earn maximum points.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <h4 className="font-medium">Submission Guidelines</h4>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
          <li>
            Create a new branch with format: <code>username/problem-id</code>
          </li>
          <li>
            Add your solution in the <code>/solutions/[problem-id]/[username].js</code> directory
          </li>
          <li>Include comments explaining your approach and time/space complexity</li>
          <li>
            Create a pull request with title: <code>[Problem ID] Solution by [Username]</code>
          </li>
          <li>Tag your submission with appropriate labels (e.g., "easy", "medium", "hard")</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Scoring System</h4>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
          <li>
            <strong>+2 points</strong> for a correct solution
          </li>
          <li>
            <strong>+1 point</strong> for well-documented & optimized code
          </li>
          <li>
            <strong>+0.5 points</strong> per social media post with #TechtronicaCodeChallenge
          </li>
          <li>
            <strong>+3 points</strong> for a full-week streak (solving all 7 problems)
          </li>
          <li>
            <strong>-5 points penalty</strong> for copied/plagiarized code
          </li>
        </ul>
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="https://github.com/techtronica/codequest" target="_blank" rel="noopener noreferrer">
          <Github className="mr-2 h-4 w-4" />
          Go to GitHub Repository
        </Link>
      </Button>
    </div>
  )
}

