import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "./config"

export async function fetchUserSubmissions(username: string) {
  try {
    // First, get the user ID from the username
    const usersQuery = query(collection(db, "users"), where("username", "==", username), limit(1))

    const userSnapshot = await getDocs(usersQuery)

    if (userSnapshot.empty) {
      return []
    }

    const userId = userSnapshot.docs[0].id

    // Then, get all submissions for this user
    const submissionsQuery = query(
      collection(db, "submissions"),
      where("userId", "==", userId),
      orderBy("submittedAt", "desc"),
    )

    const submissionsSnapshot = await getDocs(submissionsQuery)

    // Get all problem IDs from submissions
    const problemIds = submissionsSnapshot.docs.map((doc) => doc.data().problemId)

    // Fetch problem details for all submissions
    const problemsMap = new Map()

    if (problemIds.length > 0) {
      const problemsQuery = query(collection(db, "problems"), where("__name__", "in", problemIds))

      const problemsSnapshot = await getDocs(problemsQuery)

      problemsSnapshot.docs.forEach((doc) => {
        problemsMap.set(doc.id, doc.data().title)
      })
    }

    // Map submissions with problem titles
    return submissionsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        problemId: data.problemId,
        problemTitle: problemsMap.get(data.problemId) || "Unknown Problem",
        date: new Date(data.submittedAt.toDate()).toLocaleDateString(),
        status: data.status,
        points: data.points || 0,
        pullRequestUrl: data.pullRequestUrl,
      }
    })
  } catch (error) {
    console.error("Error fetching user submissions:", error)
    throw error
  }
}

