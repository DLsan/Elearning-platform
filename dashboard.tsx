"use client"

import { useState, useEffect, useCallback } from "react"
import { PlusCircle, Loader2, AlertCircle, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { CourseCard } from "./components/course-card"
import { AvailableCourses } from "./components/available-courses"
import { Assessment } from "./components/assessment"
import { useAuth } from "./components/auth-provider"
import { supabase, isOffline, safeQuery } from "./lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { courseVideos } from "./data/course-videos" // Import fallback data

interface Course {
  id: number
  title: string
  code: string
  difficulty: string
  description: string
  progress: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAvailableCourses, setShowAvailableCourses] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [usingFallbackData, setUsingFallbackData] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  // Helper function to use fallback data
  const useFallbackData = useCallback(() => {
    console.log("Using fallback course data")
    const fallbackCourses = courseVideos.map((course) => ({
      id: course.courseId,
      title: course.courseTitle,
      code: `COURSE${course.courseId}`,
      difficulty: course.courseId % 2 === 0 ? "Intermediate" : "Advanced",
      description: `Fallback description for ${course.courseTitle}`,
      progress: Math.floor(Math.random() * 100),
    }))

    setCourses(fallbackCourses)
    setUsingFallbackData(true)

    if (!offlineMode) {
      toast({
        title: "Using offline data",
        description: "Could not connect to the server. Using cached data instead.",
        variant: "default",
      })
    }
  }, [offlineMode, toast])

  // Fetch courses from Supabase
  const fetchCourses = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setFetchError(null)
      console.log("Fetching courses for user:", user.id)

      // If offline, use fallback data immediately
      if (offlineMode) {
        console.log("Offline mode detected, using fallback data")
        useFallbackData()
        return
      }

      // Check if Supabase client is properly initialized
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      // Get user enrollments first with safe query
      const { data: enrollments, error: enrollmentsError } = await safeQuery(
        () => supabase.from("user_enrollments").select("course_id").eq("user_id", user.id),
        [],
      )

      if (enrollmentsError) {
        console.error("Error fetching enrollments:", enrollmentsError)

        // If it's a network error, use fallback data
        if (
          enrollmentsError.message?.includes("Failed to") ||
          enrollmentsError.message?.includes("Network") ||
          enrollmentsError.message?.includes("offline")
        ) {
          useFallbackData()
          return
        }

        throw enrollmentsError
      }

      // If user has no enrollments, return empty array
      if (!enrollments || enrollments.length === 0) {
        setCourses([])
        setUsingFallbackData(false)
        setIsLoading(false)
        return
      }

      // Get enrolled course IDs
      const enrolledCourseIds = enrollments.map((enrollment) => enrollment.course_id)

      // Get courses that the user is enrolled in
      const { data: coursesData, error: coursesError } = await safeQuery(
        () => supabase.from("courses").select("*").in("id", enrolledCourseIds).order("id"),
        [],
      )

      if (coursesError) {
        console.error("Error fetching courses:", coursesError)

        // If it's a network error, use fallback data
        if (
          coursesError.message?.includes("Failed to") ||
          coursesError.message?.includes("Network") ||
          coursesError.message?.includes("offline")
        ) {
          useFallbackData()
          return
        }

        throw coursesError
      }

      // Get user progress for each course
      const { data: progressData, error: progressError } = await safeQuery(
        () => supabase.from("user_course_progress").select("*").eq("user_id", user.id),
        [],
      )

      if (progressError) {
        console.error("Error fetching progress:", progressError)

        // If it's a network error, use fallback data
        if (
          progressError.message?.includes("Failed to") ||
          progressError.message?.includes("Network") ||
          progressError.message?.includes("offline")
        ) {
          useFallbackData()
          return
        }

        throw progressError
      }

      // Combine course data with progress
      const coursesWithProgress = coursesData.map((course) => {
        const courseProgress = progressData?.find((p) => p.course_id === course.id)
        return {
          ...course,
          progress: courseProgress?.progress || 0,
        }
      })

      setCourses(coursesWithProgress)
      setUsingFallbackData(false)
    } catch (error: any) {
      console.error("Error in fetchCourses:", error)
      setFetchError(`Error loading courses: ${error.message || "Unknown error"}`)

      // Use fallback data for any error
      useFallbackData()
    } finally {
      setIsLoading(false)
    }
  }, [user, offlineMode, useFallbackData])

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false)
      toast({
        title: "You're back online",
        description: "Reconnected to the server. Your data will now sync.",
        variant: "default",
      })
      // Refresh data when coming back online
      if (user) fetchCourses()
    }

    const handleOffline = () => {
      setOfflineMode(true)
      toast({
        title: "You're offline",
        description: "Using cached data. Changes will sync when you reconnect.",
        variant: "destructive",
      })
    }

    // Check initial state
    setOfflineMode(isOffline())

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast, user, fetchCourses])

  // Fetch courses from Supabase
  useEffect(() => {
    if (user) {
      fetchCourses()
    } else {
      setIsLoading(false)
    }
  }, [user, fetchCourses])

  const handleTakeAssessment = (courseId: number) => {
    setSelectedCourseId(courseId)
    setShowAssessment(true)
  }

  const handleCloseAssessment = () => {
    setShowAssessment(false)
    setSelectedCourseId(null)
  }

  const handleEnrollCourse = async (courseId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in courses",
        variant: "destructive",
      })
      return
    }

    try {
      setIsEnrolling(true)

      if (usingFallbackData || offlineMode) {
        // Simulate enrollment in offline mode
        setTimeout(() => {
          const newCourse = courseVideos.find((c) => c.courseId === courseId)
          if (newCourse) {
            setCourses((prev) => [
              ...prev,
              {
                id: newCourse.courseId,
                title: newCourse.courseTitle,
                code: `COURSE${newCourse.courseId}`,
                difficulty: newCourse.courseId % 2 === 0 ? "Intermediate" : "Advanced",
                description: `Fallback description for ${newCourse.courseTitle}`,
                progress: 0,
              },
            ])
          }

          toast({
            title: "Enrollment Successful (Offline Mode)",
            description: `You have successfully enrolled in this course. Changes will sync when you're back online.`,
            variant: "default",
          })

          setShowAvailableCourses(false)
        }, 1000)
        return
      }

      // Check if Supabase client is properly initialized
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      // Check if already enrolled
      const { data: existingEnrollment, error: checkError } = await safeQuery(
        () => supabase.from("user_enrollments").select("id").eq("user_id", user.id).eq("course_id", courseId).single(),
        null,
      )

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected if not enrolled
        throw checkError
      }

      if (existingEnrollment) {
        toast({
          title: "Already Enrolled",
          description: "You are already enrolled in this course",
          variant: "default",
        })
        return
      }

      // Enroll in the course
      const { error: enrollError } = await safeQuery(
        () =>
          supabase.from("user_enrollments").insert({
            user_id: user.id,
            course_id: courseId,
          }),
        null,
      )

      if (enrollError) {
        throw enrollError
      }

      // Create initial progress record
      const { error: progressError } = await safeQuery(
        () =>
          supabase.from("user_course_progress").insert({
            user_id: user.id,
            course_id: courseId,
            progress: 0,
            completed_modules: [],
          }),
        null,
      )

      if (progressError) {
        console.warn("Error creating progress record:", progressError)
        // Continue even if progress record creation fails
      }

      // Get the course details
      const { data: courseData, error: courseError } = await safeQuery(
        () => supabase.from("courses").select("*").eq("id", courseId).single(),
        {
          id: courseId,
          title: `Course ${courseId}`,
          code: `COURSE${courseId}`,
          difficulty: "Intermediate",
          description: "Course description",
        },
      )

      if (courseError && !courseData) {
        throw courseError
      }

      // Add the course to the list with 0 progress
      setCourses((prevCourses) => [
        ...prevCourses,
        {
          ...courseData,
          progress: 0,
        },
      ])

      toast({
        title: "Enrollment Successful",
        description: `You have successfully enrolled in ${courseData.title}`,
        variant: "default",
      })

      // Close the available courses modal
      setShowAvailableCourses(false)
    } catch (error: any) {
      console.error("Error enrolling in course:", error)

      // If it's a network error, handle offline enrollment
      if (
        error.message?.includes("Failed to") ||
        error.message?.includes("Network") ||
        error.message?.includes("offline")
      ) {
        // Simulate enrollment in offline mode
        const newCourse = courseVideos.find((c) => c.courseId === courseId)
        if (newCourse) {
          setCourses((prev) => [
            ...prev,
            {
              id: newCourse.courseId,
              title: newCourse.courseTitle,
              code: `COURSE${newCourse.courseId}`,
              difficulty: newCourse.courseId % 2 === 0 ? "Intermediate" : "Advanced",
              description: `Fallback description for ${newCourse.courseTitle}`,
              progress: 0,
            },
          ])
        }

        toast({
          title: "Offline Enrollment",
          description: "You're currently offline. This enrollment will sync when you reconnect.",
          variant: "default",
        })

        setShowAvailableCourses(false)
        return
      }

      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in the course",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleCloseAvailableCourses = () => {
    setShowAvailableCourses(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
          <div className="text-white">Loading your courses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome, {user?.user_metadata?.full_name || "Student"}
              </h1>
              <p className="text-zinc-400">
                Explore your courses, track your progress, and continue your learning journey.
              </p>
              {(usingFallbackData || offlineMode) && (
                <div className="flex items-center text-yellow-500 text-sm mt-1">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span>
                    You're currently {offlineMode ? "offline" : "using offline data"}. Some features may be limited.
                  </span>
                </div>
              )}
            </div>
            <Button
              className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={() => setShowAvailableCourses(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Browse New Courses
            </Button>
          </div>

          {fetchError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Connection Error</p>
                <p className="text-sm">{fetchError}</p>
                <p className="text-sm mt-2">
                  {usingFallbackData
                    ? "Using offline data instead. Your changes will be saved when you reconnect."
                    : "Please check your internet connection and try again."}
                </p>
                {!offlineMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={fetchCourses}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}

          {courses.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-4">No courses enrolled yet</h2>
              <p className="text-zinc-400 mb-6">
                You haven't enrolled in any courses yet. Browse available courses to get started.
              </p>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 mx-auto"
                onClick={() => setShowAvailableCourses(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onTakeAssessment={handleTakeAssessment} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AvailableCourses
        isOpen={showAvailableCourses}
        onClose={handleCloseAvailableCourses}
        onEnroll={handleEnrollCourse}
        isEnrolling={isEnrolling}
        usingFallbackData={usingFallbackData || offlineMode}
      />

      {selectedCourseId && (
        <Assessment
          courseId={selectedCourseId}
          isOpen={showAssessment}
          onClose={handleCloseAssessment}
          usingFallbackData={usingFallbackData || offlineMode}
        />
      )}
    </div>
  )
}
