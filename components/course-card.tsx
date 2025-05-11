"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CourseCardProps {
  course: {
    id: number
    title: string
    code: string
    difficulty: string
    description: string
    progress: number
  }
  onTakeAssessment: (courseId: number) => void
}

export function CourseCard({ course, onTakeAssessment }: CourseCardProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

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

  const handleContinueLearning = () => {
    setIsNavigating(true)
    router.push(`/course/${course.id}`)
  }

  const handleAssessmentClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    onTakeAssessment(course.id)
  }

  return (
    <div className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-red-500 font-bold text-lg">{course.title}</h3>
            <p className="text-zinc-400 text-sm">{course.code}</p>
          </div>
          <span className={`${getDifficultyColor(course.difficulty)} text-white text-xs px-2 py-1 rounded-full`}>
            {course.difficulty}
          </span>
        </div>

        <p className="text-zinc-300 text-sm mb-4">{course.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">Progress</span>
            <span className="text-zinc-400">{course.progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleContinueLearning}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Continue Learning"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 bg-zinc-800"
            onClick={handleAssessmentClick}
            disabled={isNavigating}
          >
            Take Assessment
          </Button>
        </div>
      </div>
    </div>
  )
}
