"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { FutureCourseCard } from "@/components/future-course-card"
import { futureCourses as initialFutureCourses } from "@/data/future-courses"

export default function BrowseCoursesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [futureCourses, setFutureCourses] = useState(initialFutureCourses)

  // Load enrollment status from localStorage on initial render
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      router.push("/")
      return
    }

    // Load enrollment status from localStorage
    const savedEnrollments = localStorage.getItem("future-course-enrollments")
    if (savedEnrollments) {
      const enrolledIds = JSON.parse(savedEnrollments) as number[]

      setFutureCourses((prevCourses) =>
        prevCourses.map((course) => ({
          ...course,
          enrolled: enrolledIds.includes(course.id),
        })),
      )
    }

    setIsLoading(false)
  }, [router])

  // Handle course enrollment
  const handleEnroll = (courseId: number) => {
    // Update course enrollment status
    setFutureCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === courseId ? { ...course, enrolled: true } : course)),
    )

    // Save enrollment status to localStorage
    const updatedCourses = futureCourses.map((course) =>
      course.id === courseId ? { ...course, enrolled: true } : course,
    )

    const enrolledIds = updatedCourses.filter((course) => course.enrolled).map((course) => course.id)

    localStorage.setItem("future-course-enrollments", JSON.stringify(enrolledIds))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white">Loading courses...</div>
      </div>
    )
  }

  // Separate enrolled and available courses
  const enrolledCourses = futureCourses.filter((course) => course.enrolled)
  const availableCourses = futureCourses.filter((course) => !course.enrolled)

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-red-500">Explore More Courses</h1>
            <p className="text-zinc-400">Discover new learning opportunities and expand your knowledge.</p>
          </div>

          {/* Enrolled Future Courses Section */}
          {enrolledCourses.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">Enrolled Future Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <FutureCourseCard key={course.id} course={course} onEnroll={handleEnroll} />
                ))}
              </div>
            </div>
          )}

          {/* Available Courses Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <FutureCourseCard key={course.id} course={course} onEnroll={handleEnroll} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
