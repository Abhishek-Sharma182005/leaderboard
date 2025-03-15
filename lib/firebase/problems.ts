import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "./config"

export async function fetchDailyProblem() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayStr = today.toISOString().split("T")[0]

    const q = query(collection(db, "problems"), where("date", "==", todayStr), limit(1))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const problemDoc = querySnapshot.docs[0]
    return {
      id: problemDoc.id,
      ...problemDoc.data(),
    }
  } catch (error) {
    console.error("Error fetching daily problem:", error)
    throw error
  }
}

export async function fetchProblems(filter: "week" | "archive", userId?: string) {
  try {
    const today = new Date()
    let startDate: Date

    if (filter === "week") {
      // Get problems for the current week
      const day = today.getDay()
      startDate = new Date(today)
      startDate.setDate(today.getDate() - day)
      startDate.setHours(0, 0, 0, 0)
    } else {
      // Get problems from the past (archive)
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 30) // Last 30 days for archive
      startDate.setHours(0, 0, 0, 0)
    }

    const startDateStr = startDate.toISOString().split("T")[0]
    const todayStr = today.toISOString().split("T")[0]

    const q = query(
      collection(db, "problems"),
      where("date", ">=", startDateStr),
      where("date", "<=", todayStr),
      orderBy("date", "desc"),
    )

    const querySnapshot = await getDocs(q)

    const problems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // If userId is provided, check which problems have been solved
    if (userId) {
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", userId),
        where("status", "==", "accepted"),
      )

      const submissionsSnapshot = await getDocs(submissionsQuery)
      const solvedProblemIds = new Set(submissionsSnapshot.docs.map((doc) => doc.data().problemId))

      return problems.map((problem) => ({
        ...problem,
        solved: solvedProblemIds.has(problem.id),
      }))
    }

    return problems
  } catch (error) {
    console.error("Error fetching problems:", error)
    throw error
  }
}

