"use client"

import { Button } from "@/components/ui/button"
import type { FutureCourse } from "@/data/future-courses"

interface FutureCourseCardProps {
  course: FutureCourse
  onEnroll: (courseId: number) => void
}

export function FutureCourseCard({ course, onEnroll }: FutureCourseCardProps) {
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

        {course.enrolled ? (
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white cursor-default">Enrolled</Button>
        ) : (
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => onEnroll(course.id)}>
            Enroll
          </Button>
        )}
      </div>
    </div>
  )
}
