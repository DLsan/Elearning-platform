"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { GradeCard } from "@/components/grade-card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

interface AssessmentResult {
  id: number
  course_id: number
  score: number
  grade: string
  question_results: any[]
  strengths: string[]
  focus_areas: any[]
  tips: string[]
  created_at: string
  course?: {
    title: string
    code: string
  }
}

export default function GradesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user) {
        router.push("/")
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch assessment results with course information
        const { data, error } = await supabase
          .from("assessment_results")
          .select(`
            *,
            course:courses(title, code)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setAssessmentResults(data || [])
      } catch (err: any) {
        console.error("Error fetching grades:", err)
        setError(err.message || "Failed to load grades")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrades()
  }, [user, router])

  const handleBack = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
          <p>Loading grades...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center max-w-md mx-auto p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Grades</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-red-500">Your Grades</h1>
          <button
            onClick={handleBack}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {assessmentResults.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Assessment Results Yet</h2>
            <p className="text-zinc-400 mb-6">
              You haven't completed any assessments yet. Complete course assessments to see your grades here.
            </p>
            <button
              onClick={handleBack}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessmentResults.map((result) => (
              <GradeCard
                key={result.id}
                courseTitle={result.course?.title || "Unknown Course"}
                courseCode={result.course?.code || "N/A"}
                score={result.score}
                grade={result.grade}
                date={new Date(result.created_at).toLocaleDateString()}
                strengths={result.strengths}
                focusAreas={result.focus_areas}
                tips={result.tips}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
