"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface GradeCardProps {
  courseTitle: string
  courseCode: string
  score: number
  grade: string
  date: string
  strengths: string[]
  focusAreas: any[]
  tips: string[]
}

export function GradeCard({
  courseTitle,
  courseCode,
  score,
  grade,
  date,
  strengths,
  focusAreas,
  tips,
}: GradeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-500"
      case "B":
        return "text-blue-500"
      case "C":
        return "text-yellow-500"
      case "D":
        return "text-orange-500"
      case "F":
        return "text-red-500"
      default:
        return "text-white"
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{courseTitle}</h3>
            <p className="text-zinc-400 text-sm">{courseCode}</p>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", getGradeColor(grade))}>{grade}</div>
            <p className="text-zinc-400 text-sm">{score}%</p>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-zinc-400">
          <span>Completed on {date}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <>
                Less details <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                More details <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-zinc-800 mt-2">
          {strengths && strengths.length > 0 && (
            <div className="mb-4">
              <h4 className="text-green-500 font-medium mb-2">Strengths</h4>
              <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
                {strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {focusAreas && focusAreas.length > 0 && (
            <div className="mb-4">
              <h4 className="text-yellow-500 font-medium mb-2">Areas to Focus On</h4>
              <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
                {focusAreas.map((area: any, index: number) => (
                  <li key={index}>{typeof area === "string" ? area : JSON.stringify(area)}</li>
                ))}
              </ul>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div>
              <h4 className="text-blue-500 font-medium mb-2">Tips for Improvement</h4>
              <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
