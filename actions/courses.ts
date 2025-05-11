"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "./auth"

// Create a Supabase client configured to use cookies
const createServerClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

export async function getCourses() {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get all courses
  const { data: courses, error: coursesError } = await supabase.from("courses").select("*")

  if (coursesError) {
    return { error: coursesError.message }
  }

  // Get user's progress for each course
  const { data: progress, error: progressError } = await supabase
    .from("user_course_progress")
    .select("*")
    .eq("user_id", user.id)

  if (progressError) {
    return { error: progressError.message }
  }

  // Combine course data with progress
  const coursesWithProgress = courses.map((course) => {
    const courseProgress = progress?.find((p) => p.course_id === course.id)
    return {
      ...course,
      progress: courseProgress?.progress || 0,
    }
  })

  return { courses: coursesWithProgress }
}

export async function getCourseById(courseId: number) {
  const supabase = createServerClient()

  const { data: course, error: courseError } = await supabase.from("courses").select("*").eq("id", courseId).single()

  if (courseError) {
    return { error: courseError.message }
  }

  const { data: modules, error: modulesError } = await supabase
    .from("video_modules")
    .select("*")
    .eq("course_id", courseId)
    .order("module_order", { ascending: true })

  if (modulesError) {
    return { error: modulesError.message }
  }

  return {
    course,
    modules,
  }
}

export async function updateCourseProgress(courseId: number, progress: number, completedModules: string[]) {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if progress record exists
  const { data: existingProgress } = await supabase
    .from("user_course_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single()

  if (existingProgress) {
    // Update existing record
    const { error } = await supabase
      .from("user_course_progress")
      .update({
        progress,
        completed_modules: completedModules,
        last_accessed: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Create new record
    const { error } = await supabase.from("user_course_progress").insert({
      user_id: user.id,
      course_id: courseId,
      progress,
      completed_modules: completedModules,
    })

    if (error) {
      return { error: error.message }
    }
  }

  return { success: true }
}

export async function getFutureCourses() {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get all courses that are not in the main courses table
  // In a real app, you might have a separate table for future courses
  // For now, we'll simulate this with a different query
  const { data: futureCourses, error: coursesError } = await supabase.from("courses").select("*").gt("id", 5) // Assuming IDs 1-5 are the main courses

  if (coursesError) {
    return { error: coursesError.message }
  }

  // Get user enrollments
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("user_enrollments")
    .select("course_id")
    .eq("user_id", user.id)

  if (enrollmentsError) {
    return { error: enrollmentsError.message }
  }

  // Mark courses as enrolled if they exist in user_enrollments
  const enrolledCourseIds = enrollments?.map((e) => e.course_id) || []

  const coursesWithEnrollment = futureCourses.map((course) => ({
    ...course,
    enrolled: enrolledCourseIds.includes(course.id),
  }))

  return { courses: coursesWithEnrollment }
}

export async function enrollInCourse(courseId: number) {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("user_enrollments").insert({
    user_id: user.id,
    course_id: courseId,
  })

  if (error) {
    // If the error is because the user is already enrolled, return success
    if (error.code === "23505") {
      // Unique violation
      return { success: true }
    }
    return { error: error.message }
  }

  return { success: true }
}
