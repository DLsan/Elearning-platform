"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Dashboard from "../../dashboard"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // If not logged in, redirect to login page
          console.log("No session found, redirecting to login...")
          router.replace("/")
          return
        }

        // If logged in, show dashboard
        setHasSession(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking session:", error)
        // On error, redirect to login
        router.replace("/")
      }
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
          <div className="text-white">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  // Only render Dashboard component if we have a session
  return hasSession ? <Dashboard /> : null
}
