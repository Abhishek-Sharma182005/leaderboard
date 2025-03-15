"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Edit, Plus, Trash } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { fetchProblemsForAdmin, createProblem, updateProblem, deleteProblem } from "@/lib/firebase/admin"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  date: string
}

export function ProblemManagement() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const problemsData = await fetchProblemsForAdmin()
        setProblems(problemsData)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProblems()
  }, [])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDifficulty("Medium")
    setCategory("")
    setDate(new Date())
    setEditingProblem(null)
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem)
    setTitle(problem.title)
    setDescription(problem.description)
    setDifficulty(problem.difficulty)
    setCategory(problem.category)
    setDate(new Date(problem.date))
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!title || !description || !difficulty || !category || !date) {
      return
    }

    try {
      if (editingProblem) {
        const updatedProblem = {
          ...editingProblem,
          title,
          description,
          difficulty,
          category,
          date: format(date, "yyyy-MM-dd"),
        }

        await updateProblem(updatedProblem)

        setProblems((prev) => prev.map((p) => (p.id === editingProblem.id ? updatedProblem : p)))
      } else {
        const newProblem = {
          id: "", // Will be set by Firebase
          title,
          description,
          difficulty,
          category,
          date: format(date, "yyyy-MM-dd"),
        }

        const problemWithId = await createProblem(newProblem)
        setProblems((prev) => [...prev, problemWithId])
      }

      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving problem:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      try {
        await deleteProblem(id)
        setProblems((prev) => prev.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Error deleting problem:", error)
      }
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
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
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Problem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProblem ? "Edit Problem" : "Add New Problem"}</DialogTitle>
              <DialogDescription>
                {editingProblem ? "Update the problem details below." : "Create a new daily coding problem."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as "Easy" | "Medium" | "Hard")}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Arrays, Trees, Dynamic Programming"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3 min-h-32"
                  placeholder="Problem description, examples, constraints, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                {editingProblem ? "Update Problem" : "Add Problem"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem.id}>
              <TableCell className="font-medium">{problem.title}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>{problem.category}</TableCell>
              <TableCell>{problem.date}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(problem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleDelete(problem.id)}
                  >
                    <Trash className="h-4 w-4" />
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

