"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setDebugInfo(null)
    setIsLoading(true)

    // Simple validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("Failed to create user account")
      }

      console.log("User created successfully:", authData.user.id)
      setDebugInfo(`User created with ID: ${authData.user.id}`)

      // Step 2: Manually insert into profiles table
      try {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          console.warn("Profile creation warning:", profileError)
          setDebugInfo(`Note: User created but profile data may be incomplete. (${profileError.message})`)
        } else {
          console.log("Profile created successfully")
        }
      } catch (profileErr) {
        // If this fails, the user is still created, so just log it
        console.warn("Profile creation exception:", profileErr)
        setDebugInfo(
          `Note: User created but profile creation failed with exception. Please contact support if login issues occur.`,
        )
      }

      // Check if email confirmation is required
      if (authData.user.identities?.length === 0) {
        setSuccessMessage("This email is already registered. Please check your email for the confirmation link.")
      } else if (authData.session) {
        // If session is available, user is automatically signed in
        setSuccessMessage("Registration successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setSuccessMessage("Registration successful! Please check your email to confirm your account before logging in.")
      }

      // Clear form
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setFullName("")
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-xl shadow-lg shadow-red-900/20 p-6 md:p-8">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-red-500 mb-1">Student Portal</h1>
            <h2 className="text-2xl font-bold tracking-tight text-white">Create an Account</h2>
            <p className="text-zinc-400">Sign up to access the e-learning platform</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-md mb-6">
              {successMessage}
            </div>
          )}

          {debugInfo && (
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md mb-6 text-sm">
              {debugInfo}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

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
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/" className="text-red-500 hover:text-red-400 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
