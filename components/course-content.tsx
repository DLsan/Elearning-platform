"use client"

import { useState } from "react"
import { ArrowLeft, Clock, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { useToast } from "@/hooks/use-toast"

interface VideoModule {
  id: string
  title: string
  duration: string
  video_url: string
  description: string
  module_id: string
}

interface CourseContentProps {
  courseId: number
  courseTitle: string
  modules: VideoModule[]
  onBack: () => void
  completedModules: string[]
  progress: number
  onModuleCompletion: (moduleId: string, isCompleted: boolean) => Promise<void>
}

export function CourseContent({
  courseId,
  courseTitle,
  modules,
  onBack,
  completedModules,
  progress,
  onModuleCompletion,
}: CourseContentProps) {
  const { toast } = useToast()
  const [selectedModule, setSelectedModule] = useState<VideoModule | null>(modules.length > 0 ? modules[0] : null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const toggleModuleCompletion = async (moduleId: string) => {
    const isCompleted = completedModules.includes(moduleId)

    try {
      setIsSaving(true)
      setSaveError(null)
      await onModuleCompletion(moduleId, !isCompleted)

      // Show success toast
      toast({
        title: !isCompleted ? "Module Completed" : "Module Marked as Incomplete",
        description: !isCompleted ? "Your progress has been updated" : "Module has been marked as incomplete",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error toggling module completion:", error)
      setSaveError("Failed to update progress")

      toast({
        title: "Error Updating Progress",
        description: error.message || "Failed to update your progress",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!selectedModule) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <div className="bg-zinc-900 border-b border-zinc-800 p-4">
          <div className="container mx-auto flex items-center">
            <Button variant="ghost" size="icon" className="mr-4 text-zinc-400 hover:text-white" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-red-500">{courseTitle}</h1>
              <p className="text-zinc-400 text-sm">No modules available</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Content Available</h2>
            <p className="text-zinc-400 mb-4">This course doesn't have any modules yet.</p>
            <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" size="icon" className="mr-4 text-zinc-400 hover:text-white" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-red-500">{courseTitle}</h1>
            <p className="text-zinc-400 text-sm">Continue your learning journey</p>
          </div>
          <div className="flex items-center">
            <span className="text-zinc-400 text-sm mr-2">{progress}%</span>
            {isSaving && <Loader2 className="h-4 w-4 text-zinc-400 animate-spin ml-2" />}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-800 h-1">
        <div className="bg-red-600 h-1 transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
      </div>

      {saveError && (
        <div className="bg-red-500/10 border-b border-red-500 px-4 py-2 flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-red-500 text-sm">{saveError}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Video Player */}
        <div className="w-full lg:w-3/4 bg-zinc-950 flex flex-col">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={selectedModule.video_url}
              title={selectedModule.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedModule.title}</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{selectedModule.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Video List */}
        <div className="w-full lg:w-1/4 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white">Course Modules</h3>
            <p className="text-zinc-400 text-sm">
              {modules.length} videos • {completedModules.length} completed
            </p>
          </div>
          <div className="divide-y divide-zinc-800">
            {modules.map((module) => {
              const isCompleted = completedModules.includes(module.module_id)
              return (
                <div
                  key={module.id}
                  className={cn(
                    "p-4 hover:bg-zinc-800 transition-colors flex items-start",
                    selectedModule.id === module.id && "bg-zinc-800",
                    isCompleted && "opacity-70",
                  )}
                >
                  <button className="flex-1 text-left mr-2" onClick={() => setSelectedModule(module)}>
                    <h4
                      className={cn(
                        "font-medium mb-1",
                        selectedModule.id === module.id ? "text-red-500" : "text-white",
                        isCompleted && "line-through opacity-70",
                      )}
                    >
                      {module.title}
                    </h4>
                    <div className="flex items-center text-zinc-400 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {module.duration}
                    </div>
                  </button>
                  <button
                    onClick={() => toggleModuleCompletion(module.module_id)}
                    className={cn(
                      "flex-shrink-0 p-1 rounded-full transition-colors",
                      isCompleted ? "text-green-500 hover:text-green-400" : "text-zinc-500 hover:text-zinc-400",
                      isSaving && "opacity-50 cursor-not-allowed",
                    )}
                    disabled={isSaving}
                    aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle className={cn("h-5 w-5", isCompleted ? "fill-green-500" : "fill-transparent")} />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
