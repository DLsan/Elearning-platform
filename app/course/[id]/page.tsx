"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, AlertCircle, BookOpen } from "lucide-react"
import { CourseContent } from "@/components/course-content"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface VideoModule {
  id: string
  title: string
  duration: string
  video_url: string
  description: string
  module_id: string
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [courseId, setCourseId] = useState<number | null>(null)
  const [courseTitle, setCourseTitle] = useState("")
  const [modules, setModules] = useState<VideoModule[]>([])
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreatingModules, setIsCreatingModules] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user) {
        router.push("/")
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        if (!params.id) {
          throw new Error("Course ID is required")
        }

        const id = Number.parseInt(params.id)
        setCourseId(id)

        // Get course details
        const { data: course, error: courseError } = await supabase.from("courses").select("*").eq("id", id).single()

        if (courseError) {
          throw courseError
        }

        setCourseTitle(course.title)

        // Get course modules
        const { data: modulesData, error: modulesError } = await supabase
          .from("video_modules")
          .select("*")
          .eq("course_id", id)
          .order("module_order", { ascending: true })

        if (modulesError) {
          throw modulesError
        }

        // Check if we have modules
        if (!modulesData || modulesData.length === 0) {
          console.log(`No modules found for course ${id}: ${course.title}`)
          setModules([])
        } else {
          setModules(modulesData)
        }

        // Check if user is enrolled in this course
        const { data: enrollment, error: enrollmentError } = await supabase
          .from("user_enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .single()

        // If not enrolled, automatically enroll them
        if (enrollmentError && enrollmentError.code === "PGRST116") {
          // No enrollment found, create one
          const { error: createEnrollmentError } = await supabase.from("user_enrollments").insert({
            user_id: user.id,
            course_id: id,
          })

          if (createEnrollmentError) {
            console.error("Error creating enrollment:", createEnrollmentError)
          } else {
            console.log(`User ${user.id} automatically enrolled in course ${id}`)
          }
        } else if (enrollmentError) {
          console.error("Error checking enrollment:", enrollmentError)
        }

        // Get user progress
        const { data: progressData, error: progressError } = await supabase
          .from("user_course_progress")
          .select("progress, completed_modules")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .single()

        if (progressError && progressError.code !== "PGRST116") {
          throw progressError
        }

        if (progressData) {
          setProgress(progressData.progress || 0)
          setCompletedModules(progressData.completed_modules || [])
        } else {
          // Create initial progress record if it doesn't exist
          const { error: createError } = await supabase.from("user_course_progress").insert({
            user_id: user.id,
            course_id: id,
            progress: 0,
            completed_modules: [],
          })

          if (createError) {
            console.error("Error creating progress record:", createError)
          }
        }

        // Update last_accessed timestamp
        await supabase
          .from("user_course_progress")
          .update({ last_accessed: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("course_id", id)
      } catch (err: any) {
        console.error("Error fetching course data:", err)
        setError(err.message || "Failed to load course")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [params.id, router, user, toast])

  const handleModuleCompletion = async (moduleId: string, isCompleted: boolean) => {
    if (!user || !courseId) return

    try {
      let newCompletedModules: string[]

      if (isCompleted) {
        // Add module to completed modules
        newCompletedModules = [...completedModules, moduleId]
      } else {
        // Remove module from completed modules
        newCompletedModules = completedModules.filter((id) => id !== moduleId)
      }

      // Calculate new progress percentage
      const newProgress = modules.length > 0 ? Math.round((newCompletedModules.length / modules.length) * 100) : 0

      // Update state
      setCompletedModules(newCompletedModules)
      setProgress(newProgress)

      // Update in database
      const { error } = await supabase
        .from("user_course_progress")
        .update({
          progress: newProgress,
          completed_modules: newCompletedModules,
          last_accessed: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("course_id", courseId)

      if (error) {
        throw error
      }

      // Show toast for 100% completion
      if (newProgress === 100 && progress !== 100) {
        toast({
          title: "Course Completed!",
          description: "Congratulations! You've completed all modules in this course.",
          variant: "default",
        })
      }
    } catch (err: any) {
      console.error("Error updating module completion:", err)
      toast({
        title: "Update Failed",
        description: "Failed to update your progress. Please try again.",
        variant: "destructive",
      })

      // Revert state changes
      setCompletedModules(completedModules)
      setProgress(progress)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center max-w-md mx-auto p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Course</h1>
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

  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Course Not Found</h1>
          <p className="text-zinc-400 mb-6">The course you are looking for does not exist.</p>
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

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center max-w-md mx-auto p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <BookOpen className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{courseTitle}</h1>
          <p className="text-zinc-400 mb-6">
            This course doesn't have any content yet. Please check back later or try another course.
          </p>
          <div className="flex flex-col gap-4">
            <Button onClick={handleBack} className="bg-red-600 hover:bg-red-700 text-white transition-colors">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <CourseContent
      courseId={courseId}
      courseTitle={courseTitle}
      modules={modules}
      onBack={handleBack}
      completedModules={completedModules}
      progress={progress}
      onModuleCompletion={handleModuleCompletion}
    />
  )
}
