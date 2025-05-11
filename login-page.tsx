"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client not initialized")
          setIsCheckingSession(false)
          return
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error checking session:", sessionError)
          setDebugInfo(`Session check error: ${sessionError.message}`)
        }

        if (session) {
          // User is already logged in, redirect to dashboard
          console.log("User already logged in, redirecting to dashboard...")
          router.replace("/dashboard")
        } else {
          console.log("No active session found")
        }
      } catch (err) {
        console.error("Error checking session:", err)
        setDebugInfo(`Session check exception: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo(null)
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      console.log(`Attempting to sign in with email: ${email.substring(0, 3)}...`)

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Authentication error:", error)
        throw error
      }

      if (data.session) {
        // Successfully logged in, redirect to dashboard
        console.log("Login successful, redirecting to dashboard...")
        router.replace("/dashboard")
      } else {
        throw new Error("Failed to create session")
      }
    } catch (err: any) {
      console.error("Login error:", err)

      // Provide more helpful error messages
      if (err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else if (err.message.includes("Email not confirmed")) {
        setError("Please confirm your email address before logging in. Check your inbox for a confirmation link.")
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.")
      }

      // Add debug info for troubleshooting
      setDebugInfo(`Error type: ${err.name || "Unknown"}, Status: ${err.status || "N/A"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
          <p className="text-white">Checking login status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-xl shadow-lg shadow-red-900/20 p-6 md:p-8">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-red-500 mb-1">Student Portal</h1>
            <h2 className="text-2xl font-bold tracking-tight text-white">Login</h2>
            <p className="text-zinc-400">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {debugInfo && (
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md mb-6 text-sm">
              <p className="font-medium">Debug Info:</p>
              <p>{debugInfo}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500"
                />
                <Label htmlFor="remember" className="text-sm text-zinc-400">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-red-500 hover:text-red-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-red-500 hover:text-red-400 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
