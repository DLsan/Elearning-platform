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

export async function getAssessmentQuestions(courseId: number) {
  const supabase = createServerClient()

  const { data: questions, error } = await supabase.from("questions").select("*").eq("course_id", courseId)

  if (error) {
    return { error: error.message }
  }

  return { questions }
}

export async function submitAssessment(courseId: number, score: number, grade: string, questionResults: any[]) {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Generate strengths, focus areas, and tips based on question results
  const strengths: string[] = []
  const focusAreas: { topic: string; description: string }[] = []
  const tips: string[] = []

  // Group question results by topic
  const topicResults: Record<string, { correct: number; total: number }> = {}

  questionResults.forEach((result) => {
    if (!topicResults[result.topic]) {
      topicResults[result.topic] = { correct: 0, total: 0 }
    }

    topicResults[result.topic].total += 1
    if (result.correct) {
      topicResults[result.topic].correct += 1
    }
  })

  // Determine strengths and focus areas
  Object.entries(topicResults).forEach(([topic, { correct, total }]) => {
    const percentage = (correct / total) * 100

    if (percentage >= 80) {
      strengths.push(topic)
    } else if (percentage <= 60) {
      focusAreas.push({
        topic,
        description: `You missed ${total - correct} out of ${total} questions on ${topic}.`,
      })

      // Add a tip for each focus area
      tips.push(`Review the ${topic} section in the course materials and practice more examples.`)
    }
  })

  // Save assessment result
  const { error } = await supabase.from("assessment_results").insert({
    user_id: user.id,
    course_id: courseId,
    score,
    grade,
    question_results: questionResults,
    strengths,
    focus_areas: focusAreas,
    tips,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getAssessmentResults() {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get all courses
  const { data: courses, error: coursesError } = await supabase.from("courses").select("id, title")

  if (coursesError) {
    return { error: coursesError.message }
  }

  // Get user's assessment results
  const { data: results, error: resultsError } = await supabase
    .from("assessment_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (resultsError) {
    return { error: resultsError.message }
  }

  // Group results by course and get the latest result for each course
  const latestResults = new Map()

  results?.forEach((result) => {
    if (
      !latestResults.has(result.course_id) ||
      new Date(result.created_at) > new Date(latestResults.get(result.course_id).created_at)
    ) {
      latestResults.set(result.course_id, result)
    }
  })

  // Create a complete list of assessment results for all courses
  const assessmentResults = courses?.map((course) => {
    const result = latestResults.get(course.id)

    if (result) {
      return {
        courseId: course.id,
        courseTitle: course.title,
        completed: true,
        score: result.score,
        grade: result.grade,
        date: result.created_at,
        strengths: result.strengths,
        focusAreas: result.focus_areas,
        tips: result.tips,
        questionResults: result.question_results,
      }
    } else {
      return {
        courseId: course.id,
        courseTitle: course.title,
        completed: false,
        score: 0,
        grade: "N/A",
      }
    }
  })

  return { assessmentResults }
}
