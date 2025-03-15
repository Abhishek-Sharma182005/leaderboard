import { ProblemList } from "@/components/problem-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SubmissionGuide } from "@/components/submission-guide"

export default function ProblemsPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Problems</h1>
        <p className="text-muted-foreground">
          One new problem is assigned each day. Submit your solutions via GitHub to earn points.
        </p>
      </div>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Today's Problem</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem of the Day</CardTitle>
              <CardDescription>March 15, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Balanced Binary Tree</h3>
                <p className="text-sm text-muted-foreground">
                  Difficulty: Medium • Category: Trees • Time Limit: 1 second
                </p>
                <Separator />
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as
                    a binary tree in which the depth of the two subtrees of every node never differ by more than 1.
                  </p>
                  <h4>Example 1:</h4>
                  <pre>
                    <code>Input: root = [3,9,20,null,null,15,7] Output: true</code>
                  </pre>
                  <h4>Example 2:</h4>
                  <pre>
                    <code>Input: root = [1,2,2,3,3,null,null,4,4] Output: false</code>
                  </pre>
                  <h4>Constraints:</h4>
                  <ul>
                    <li>The number of nodes in the tree is in the range [0, 5000].</li>
                    <li>-10^4 &lt;= Node.val &lt;= 10^4</li>
                  </ul>
                </div>
              </div>
              <SubmissionGuide />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="week">
          <ProblemList filter="week" />
        </TabsContent>
        <TabsContent value="archive">
          <ProblemList filter="archive" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

