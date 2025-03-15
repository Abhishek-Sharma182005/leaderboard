import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore"
import { db } from "./config"

// Problem Management
export async function fetchProblemsForAdmin() {
  try {
    const q = query(collection(db, "problems"), orderBy("date", "desc"))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching problems for admin:", error)
    throw error
  }
}

export async function createProblem(problem: any) {
  try {
    const docRef = doc(collection(db, "problems"))
    await setDoc(docRef, problem)

    return {
      id: docRef.id,
      ...problem,
    }
  } catch (error) {
    console.error("Error creating problem:", error)
    throw error
  }
}

export async function updateProblem(problem: any) {
  try {
    const { id, ...data } = problem
    await updateDoc(doc(db, "problems", id), data)
    return problem
  } catch (error) {
    console.error("Error updating problem:", error)
    throw error
  }
}

export async function deleteProblem(id: string) {
  try {
    await deleteDoc(doc(db, "problems", id))
    return true
  } catch (error) {
    console.error("Error deleting problem:", error)
    throw error
  }
}

// Submission Management
export async function fetchPendingSubmissions() {
  try {
    const q = query(collection(db, "submissions"), where("status", "==", "pending"), orderBy("submittedAt", "desc"))

    const querySnapshot = await getDocs(q)

    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Get user details for each submission
    const userIds = [...new Set(submissions.map((s) => s.userId))]
    const problemIds = [...new Set(submissions.map((s) => s.problemId))]

    const usersMap = new Map()
    const problemsMap = new Map()

    if (userIds.length > 0) {
      const usersQuery = query(collection(db, "users"), where("__name__", "in", userIds))

      const usersSnapshot = await getDocs(usersQuery)

      usersSnapshot.docs.forEach((doc) => {
        usersMap.set(doc.id, {
          username: doc.data().username,
          photoURL: doc.data().photoURL,
        })
      })
    }

    if (problemIds.length > 0) {
      const problemsQuery = query(collection(db, "problems"), where("__name__", "in", problemIds))

      const problemsSnapshot = await getDocs(problemsQuery)

      problemsSnapshot.docs.forEach((doc) => {
        problemsMap.set(doc.id, doc.data().title)
      })
    }

    // Map submissions with user and problem details
    return submissions.map((submission) => {
      const user = usersMap.get(submission.userId) || {}
      return {
        ...submission,
        username: user.username || "Unknown User",
        photoURL: user.photoURL,
        problemTitle: problemsMap.get(submission.problemId) || "Unknown Problem",
        date: new Date(submission.submittedAt.toDate()).toLocaleDateString(),
      }
    })
  } catch (error) {
    console.error("Error fetching pending submissions:", error)
    throw error
  }
}

export async function approveSubmission(submissionId: string, isOptimized = false) {
  try {
    const submissionRef = doc(db, "submissions", submissionId)
    const submissionDoc = await getDoc(submissionRef)

    if (!submissionDoc.exists()) {
      throw new Error("Submission not found")
    }

    const submissionData = submissionDoc.data()
    const userId = submissionData.userId

    // Calculate points
    let points = 2 // Base points for correct solution
    if (isOptimized) {
      points += 1 // Bonus point for optimized solution
    }

    // Update submission status
    await updateDoc(submissionRef, {
      status: "accepted",
      points,
      reviewedAt: new Date(),
      isOptimized,
    })

    // Update user's leaderboard entry
    const leaderboardRef = doc(db, "leaderboard", userId)
    const leaderboardDoc = await getDoc(leaderboardRef)

    if (leaderboardDoc.exists()) {
      const currentPoints = leaderboardDoc.data().points || 0
      const problemsSolved = leaderboardDoc.data().problemsSolved || 0

      await updateDoc(leaderboardRef, {
        points: currentPoints + points,
        problemsSolved: problemsSolved + 1,
        lastUpdated: new Date(),
      })
    } else {
      // Get user data
      const userDoc = await getDoc(doc(db, "users", userId))

      if (userDoc.exists()) {
        const userData = userDoc.data()

        await setDoc(leaderboardRef, {
          userId,
          username: userData.username,
          photoURL: userData.photoURL,
          points,
          problemsSolved: 1,
          streak: 1,
          isTechtronica: userData.isTechtronica || false,
          lastUpdated: new Date(),
        })
      }
    }

    return true
  } catch (error) {
    console.error("Error approving submission:", error)
    throw error
  }
}

export async function rejectSubmission(submissionId: string, isPlagiarized = false) {
  try {
    const submissionRef = doc(db, "submissions", submissionId)
    const submissionDoc = await getDoc(submissionRef)

    if (!submissionDoc.exists()) {
      throw new Error("Submission not found")
    }

    const submissionData = submissionDoc.data()
    const userId = submissionData.userId

    // Update submission status
    await updateDoc(submissionRef, {
      status: "rejected",
      isPlagiarized,
      reviewedAt: new Date(),
    })

    // If plagiarized, apply penalty to user's leaderboard entry
    if (isPlagiarized) {
      const leaderboardRef = doc(db, "leaderboard", userId)
      const leaderboardDoc = await getDoc(leaderboardRef)

      if (leaderboardDoc.exists()) {
        const currentPoints = leaderboardDoc.data().points || 0

        await updateDoc(leaderboardRef, {
          points: Math.max(0, currentPoints - 5), // Apply penalty, but don't go below 0
          lastUpdated: new Date(),
        })
      }
    }

    return true
  } catch (error) {
    console.error("Error rejecting submission:", error)
    throw error
  }
}

// User Management
export async function fetchUsers() {
  try {
    const q = query(collection(db, "users"), orderBy("joinedDate", "desc"))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      joinedDate: new Date(doc.data().joinedDate).toLocaleDateString(),
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function updateUserRole(userId: string, role: "admin" | "techtronica", value: boolean) {
  try {
    const userRef = doc(db, "users", userId)

    if (role === "admin") {
      await updateDoc(userRef, { isAdmin: value })
    } else {
      await updateDoc(userRef, { isTechtronica: value })

      // Also update the leaderboard entry if it exists
      const leaderboardRef = doc(db, "leaderboard", userId)
      const leaderboardDoc = await getDoc(leaderboardRef)

      if (leaderboardDoc.exists()) {
        await updateDoc(leaderboardRef, { isTechtronica: value })
      }
    }

    return true
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

export async function banUser(userId: string, ban: boolean) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { isBanned: ban })

    return true
  } catch (error) {
    console.error("Error banning/unbanning user:", error)
    throw error
  }
}

// Admin Dashboard Stats
export async function fetchAdminStats() {
  try {
    // Get total users count
    const usersQuery = query(collection(db, "users"))
    const usersSnapshot = await getDocs(usersQuery)
    const totalUsers = usersSnapshot.size

    // Get total problems count
    const problemsQuery = query(collection(db, "problems"))
    const problemsSnapshot = await getDocs(problemsQuery)
    const totalProblems = problemsSnapshot.size

    // Get submissions counts
    const pendingQuery = query(collection(db, "submissions"), where("status", "==", "pending"))
    const pendingSnapshot = await getDocs(pendingQuery)
    const pendingSubmissions = pendingSnapshot.size

    const approvedQuery = query(collection(db, "submissions"), where("status", "==", "accepted"))
    const approvedSnapshot = await getDocs(approvedQuery)
    const approvedSubmissions = approvedSnapshot.size

    const rejectedQuery = query(collection(db, "submissions"), where("status", "==", "rejected"))
    const rejectedSnapshot = await getDocs(rejectedQuery)
    const rejectedSubmissions = rejectedSnapshot.size

    return {
      totalUsers,
      totalProblems,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw error
  }
}

