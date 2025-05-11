"use client"

import { useState, useEffect } from "react"
import { X, Loader2, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, isOffline, safeQuery } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { courseVideos } from "@/data/course-videos" // Import fallback data

interface Course {
  id: number
  title: string
  code: string
  difficulty: string
  description: string
  enrolled: boolean
}

interface AvailableCoursesProps {
  isOpen: boolean
  onClose: () => void
  onEnroll: (courseId: number) => void
  isEnrolling: boolean
  usingFallbackData?: boolean
}

export function AvailableCourses({
  isOpen,
  onClose,
  onEnroll,
  isEnrolling,
  usingFallbackData = false,
}: AvailableCoursesProps) {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!isOpen || !user) return

      try {
        setIsLoading(true)
        setError(null)

        // If using fallback data due to connection issues or offline
        if (usingFallbackData || isOffline()) {
          console.log("Using fallback data for available courses")
          // Create fallback courses from the course videos data
          const fallbackCourses = courseVideos.map((course) => ({
            id: course.courseId,
            title: course.courseTitle,
            code: `COURSE${course.courseId}`,
            difficulty: course.courseId % 2 === 0 ? "Intermediate" : "Advanced",
            description: `Fallback description for ${course.courseTitle}`,
            enrolled: false,
          }))

          setCourses(fallbackCourses)
          setIsLoading(false)
          return
        }

        // Check if Supabase client is properly initialized
        if (!supabase) {
          throw new Error("Supabase client is not initialized")
        }

        // Get all courses with safe query
        const { data: coursesData, error: coursesError } = await safeQuery(
          () => supabase.from("courses").select("*").order("id"),
          [],
        )

        if (coursesError) {
          throw coursesError
        }

        // Get user enrollments with safe query
        const { data: enrollments, error: enrollmentsError } = await safeQuery(
          () => supabase.from("user_enrollments").select("course_id").eq("user_id", user.id),
          [],
        )

        if (enrollmentsError) {
          throw enrollmentsError
        }

        // Get enrolled course IDs
        const enrolledCourseIds = enrollments?.map((enrollment) => enrollment.course_id) || []

        // Mark courses as enrolled if they exist in user_enrollments
        const coursesWithEnrollment = coursesData.map((course) => ({
          ...course,
          enrolled: enrolledCourseIds.includes(course.id),
        }))

        setCourses(coursesWithEnrollment)
      } catch (error: any) {
        console.error("Error fetching available courses:", error)
        setError(error.message || "Failed to load courses")

        // Use fallback data if fetch fails
        if (
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("NetworkError") ||
          error.message?.includes("offline")
        ) {
          console.log("Using fallback course data due to fetch error")
          const fallbackCourses = courseVideos.map((course) => ({
            id: course.courseId,
            title: course.courseTitle,
            code: `COURSE${course.courseId}`,
            difficulty: course.courseId % 2 === 0 ? "Intermediate" : "Advanced",
            description: `Fallback description for ${course.courseTitle}`,
            enrolled: false,
          }))

          setCourses(fallbackCourses)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [isOpen, user, usingFallbackData])

  const handleEnroll = async (courseId: number) => {
    setEnrollingCourseId(courseId)
    await onEnroll(courseId)

    // Update the local state to mark the course as enrolled
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === courseId ? { ...course, enrolled: true } : course)),
    )

    setEnrollingCourseId(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600"
      case "Intermediate":
        return "bg-yellow-600"
      case "Advanced":
        return "bg-red-600"
      default:
        return "bg-blue-600"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 z-10 flex justify-between items-center p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Available Courses</h2>
            {usingFallbackData && (
              <div className="flex items-center text-yellow-500 text-sm">
                <WifiOff className="h-4 w-4 mr-1" />
                <span>Offline mode - Some features may be limited</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-red-500 animate-spin mr-2" />
              <span className="text-zinc-400">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md">
              <p className="font-medium">Error loading courses</p>
              <p className="text-sm">{error}</p>
              {courses.length > 0 && <p className="text-sm mt-2">Showing available offline courses instead.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-red-500 font-bold text-lg">{course.title}</h3>
                        <p className="text-zinc-400 text-sm">{course.code}</p>
                      </div>
                      <span
                        className={`${getDifficultyColor(course.difficulty)} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {course.difficulty}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-sm mb-4">{course.description}</p>

                    <Button
                      className={
                        course.enrolled
                          ? "bg-green-600 hover:bg-green-700 text-white w-full"
                          : "bg-red-600 hover:bg-red-700 text-white w-full"
                      }
                      onClick={() => !course.enrolled && handleEnroll(course.id)}
                      disabled={course.enrolled || isEnrolling || enrollingCourseId === course.id}
                    >
                      {enrollingCourseId === course.id ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enrolling...
                        </span>
                      ) : course.enrolled ? (
                        "Enrolled"
                      ) : (
                        "Enroll"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
