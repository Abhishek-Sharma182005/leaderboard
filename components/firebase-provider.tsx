"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { db } from "@/lib/firebase/config"

interface FirebaseContextType {
  db: typeof db
}

const FirebaseContext = createContext<FirebaseContextType>({
  db,
})

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseContext.Provider value={{ db }}>{children}</FirebaseContext.Provider>
}

export const useFirebase = () => useContext(FirebaseContext)

