import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./config"

interface UserProfile {
  uid: string
  email: string
  username: string
  displayName: string
  photoURL: string
  isAdmin: boolean
  isTechtronica: boolean
  joinedDate: string
}

export async function fetchUserProfile(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))

    if (userDoc.exists()) {
      return userDoc.data()
    }

    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export async function createUserProfile(profile: UserProfile) {
  try {
    await setDoc(doc(db, "users", profile.uid), profile)
    return profile
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export async function fetchUserBadges(username: string) {
  try {
    // Mock data for badges - in a real app, this would come from Firestore
    return [
      {
        id: "streak-7",
        name: "7-Day Streak",
        description: "Solved problems for 7 consecutive days",
        icon: "streak",
        earned: true,
        date: "March 10, 2025",
      },
      {
        id: "streak-30",
        name: "30-Day Streak",
        description: "Solved problems for 30 consecutive days",
        icon: "streak",
        earned: false,
      },
      {
        id: "problems-10",
        name: "10 Problems",
        description: "Solved 10 coding problems",
        icon: "problems",
        earned: true,
        date: "March 5, 2025",
      },
      {
        id: "problems-50",
        name: "50 Problems",
        description: "Solved 50 coding problems",
        icon: "problems",
        earned: false,
      },
      {
        id: "optimization-5",
        name: "Optimizer",
        description: "Received 5 optimized solution badges",
        icon: "optimization",
        earned: true,
        date: "March 12, 2025",
      },
      {
        id: "contribution-10",
        name: "Contributor",
        description: "Made 10 contributions to the repository",
        icon: "contribution",
        earned: false,
      },
      {
        id: "social-5",
        name: "Social Coder",
        description: "Shared 5 solutions on social media",
        icon: "social",
        earned: true,
        date: "March 8, 2025",
      },
      {
        id: "achievement-top10",
        name: "Top 10",
        description: "Reached top 10 on the leaderboard",
        icon: "achievement",
        earned: false,
      },
    ]
  } catch (error) {
    console.error("Error fetching user badges:", error)
    throw error
  }
}

export async function fetchUserStats(username: string) {
  try {
    // In a real app, this would fetch actual stats from Firestore
    // For now, returning mock data
    return {
      totalPoints: 42,
      problemsSolved: 15,
      currentStreak: 7,
      longestStreak: 14,
      rank: 12,
      socialShares: 5,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw error
  }
}

