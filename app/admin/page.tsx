import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PendingSubmissions } from "@/components/admin/pending-submissions"
import { ProblemManagement } from "@/components/admin/problem-management"
import { UserManagement } from "@/components/admin/user-management"
import { AdminStats } from "@/components/admin/admin-stats"

export default function AdminDashboardPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage problems, review submissions, and monitor user activity.</p>
      </div>

      <AdminStats />

      <Tabs defaultValue="submissions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions</CardTitle>
              <CardDescription>Review and approve user submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <PendingSubmissions />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Problem Management</CardTitle>
              <CardDescription>Create, edit, and schedule daily problems</CardDescription>
            </CardHeader>
            <CardContent>
              <ProblemManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

