"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import LoginPage from "../login-page"
import { supabase } from "@/lib/supabase"

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // If logged in, redirect to dashboard
          router.push("/dashboard")
        } else {
          // If not logged in, show login page
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  return <LoginPage />
}
