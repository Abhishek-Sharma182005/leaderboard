import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore"
import { db } from "./config"

export async function fetchLeaderboardPreview() {
  try {
    const q = query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(3))

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching leaderboard preview:", error)
    throw error
  }
}

export async function fetchLeaderboard(filter: "all" | "techtronica" | "open") {
  try {
    let q

    if (filter === "all") {
      q = query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(100))
    } else if (filter === "techtronica") {
      q = query(
        collection(db, "leaderboard"),
        where("isTechtronica", "==", true),
        orderBy("points", "desc"),
        limit(100),
      )
    } else {
      q = query(
        collection(db, "leaderboard"),
        where("isTechtronica", "==", false),
        orderBy("points", "desc"),
        limit(100),
      )
    }

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    throw error
  }
}

