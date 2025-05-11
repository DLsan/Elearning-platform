"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error("Error refreshing session:", error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...")

        // Check if Supabase client is properly initialized
        if (!supabase) {
          throw new Error("Supabase client is not initialized")
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        console.log("Session retrieved:", session ? "Session exists" : "No session")
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null

    try {
      if (supabase) {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event)
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)

          // If user logs out, redirect to login page
          if (!session && event === "SIGNED_OUT") {
            console.log("User signed out, redirecting to login...")
            router.replace("/")
          }

          // If user signs in, check if they have a profile
          if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
            try {
              // Check if user has a profile
              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single()

              // If no profile exists, create one
              if (profileError && profileError.code === "PGRST116") {
                console.log("No profile found for user, creating one...")
                const { error: insertError } = await supabase.from("profiles").insert({
                  id: session.user.id,
                  full_name: session.user.user_metadata?.full_name || "User",
                  email: session.user.email,
                  updated_at: new Date().toISOString(),
                })

                if (insertError) {
                  console.error("Error creating profile:", insertError)
                } else {
                  console.log("Profile created successfully")
                }
              }
            } catch (error) {
              console.error("Error checking/creating profile:", error)
            }
          }
        })

        subscription = data.subscription
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router])

  const signOut = async () => {
    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      await supabase.auth.signOut()
      router.replace("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
