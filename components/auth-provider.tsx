"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, githubProvider } from "@/lib/firebase/config"
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { fetchUserProfile, createUserProfile } from "@/lib/firebase/users"

interface User extends FirebaseUser {
  username?: string
  isAdmin?: boolean
  isTechtronica?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user data from Firestore
          const userProfile = await fetchUserProfile(firebaseUser.uid)

          if (userProfile) {
            // Combine Firebase user with Firestore profile
            setUser({
              ...firebaseUser,
              username: userProfile.username,
              isAdmin: userProfile.isAdmin,
              isTechtronica: userProfile.isTechtronica,
            })
          } else {
            // Create a new user profile if it doesn't exist
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              username:
                firebaseUser.displayName?.replace(/\s+/g, "").toLowerCase() || `user${Date.now().toString().slice(-6)}`,
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
              isAdmin: false,
              isTechtronica: false,
              joinedDate: new Date().toISOString(),
            }

            await createUserProfile(newProfile)
            setUser({
              ...firebaseUser,
              username: newProfile.username,
              isAdmin: newProfile.isAdmin,
              isTechtronica: newProfile.isTechtronica,
            })
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUser(firebaseUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider)
    } catch (error) {
      console.error("Error signing in:", error)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

