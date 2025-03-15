"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ban, Check, Search } from "lucide-react"
import { fetchUsers, updateUserRole, banUser } from "@/lib/firebase/admin"

interface User {
  id: string
  username: string
  email: string
  photoURL?: string
  isTechtronica: boolean
  isAdmin: boolean
  isBanned: boolean
  joinedDate: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers()
        setUsers(usersData)
        setFilteredUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const handleRoleChange = async (userId: string, role: "admin" | "techtronica", value: boolean) => {
    try {
      await updateUserRole(userId, role, value)
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              isAdmin: role === "admin" ? value : user.isAdmin,
              isTechtronica: role === "techtronica" ? value : user.isTechtronica,
            }
          }
          return user
        }),
      )
    } catch (error) {
      console.error(`Error updating user ${role} status:`, error)
    }
  }

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      await banUser(userId, ban)
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === userId) {
            return { ...user, isBanned: ban }
          }
          return user
        }),
      )
    } catch (error) {
      console.error("Error banning/unbanning user:", error)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Roles</TableHead>
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
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} className={user.isBanned ? "bg-muted/50" : ""}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || `/placeholder.svg?height=32&width=32`} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username}</span>
                  {user.isBanned && (
                    <Badge variant="destructive" className="ml-2">
                      Banned
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.joinedDate}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`techtronica-${user.id}`}
                      checked={user.isTechtronica}
                      onCheckedChange={(checked) => handleRoleChange(user.id, "techtronica", checked as boolean)}
                    />
                    <Label htmlFor={`techtronica-${user.id}`}>Techtronica Member</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`admin-${user.id}`}
                      checked={user.isAdmin}
                      onCheckedChange={(checked) => handleRoleChange(user.id, "admin", checked as boolean)}
                    />
                    <Label htmlFor={`admin-${user.id}`}>Admin</Label>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  {user.isBanned ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-500 hover:text-green-600"
                      onClick={() => handleBanUser(user.id, false)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Unban
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleBanUser(user.id, true)}
                    >
                      <Ban className="mr-1 h-4 w-4" /> Ban
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

