"use client"

import { useState, useEffect } from "react"
import { X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { assessmentQuestions } from "@/data/assessment-questions" // Import fallback data

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
}

interface AssessmentProps {
  courseId: number
  isOpen: boolean
  onClose: () => void
  usingFallbackData?: boolean
}

export function Assessment({ courseId, isOpen, onClose, usingFallbackData = false }: AssessmentProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [courseTitle, setCourseTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [score, setScore] = useState(0)
  const [grade, setGrade] = useState("")

  // Fetch questions from Supabase or use fallback data
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!isOpen || !user) return

      try {
        setIsLoading(true)
        setError(null)
        setIsSubmitted(false)
        setSelectedAnswers([])
        setCurrentQuestionIndex(0)

        // If using fallback data due to connection issues
        if (usingFallbackData) {
          console.log("Using fallback data for assessment questions")
          // Find the course in the fallback data
          const courseData = assessmentQuestions.find((c) => c.courseId === courseId)

          if (courseData) {
            setCourseTitle(courseData.courseTitle)

            // Convert the fallback questions to the format expected by the component
            const formattedQuestions = courseData.questions.map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              correct_answer: q.correctAnswer,
            }))

            setQuestions(formattedQuestions)
            setSelectedAnswers(Array(formattedQuestions.length).fill(-1))
          } else {
            throw new Error("Course not found in offline data")
          }

          setIsLoading(false)
          return
        }

        // Check if Supabase client is properly initialized
        if (!supabase) {
          throw new Error("Supabase client is not initialized")
        }

        // Get course title
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("title")
          .eq("id", courseId)
          .single()

        if (courseError) throw courseError
        setCourseTitle(courseData.title)

        // Get questions
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .eq("course_id", courseId)

        if (questionsError) throw questionsError

        if (questionsData.length === 0) {
          // If no questions in database, create some sample questions
          await createSampleQuestions(courseId)

          // Fetch again
          const { data: newQuestionsData, error: newQuestionsError } = await supabase
            .from("questions")
            .select("*")
            .eq("course_id", courseId)

          if (newQuestionsError) throw newQuestionsError

          // Parse options from JSON string if needed
          const parsedQuestions = newQuestionsData.map((q) => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
          }))

          setQuestions(parsedQuestions)
        } else {
          // Parse options from JSON string if needed
          const parsedQuestions = questionsData.map((q) => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
          }))

          setQuestions(parsedQuestions)
        }

        // Initialize selected answers array
        setSelectedAnswers(Array(questionsData.length).fill(-1))
      } catch (error: any) {
        console.error("Error fetching questions:", error)
        setError(error.message || "Failed to load assessment questions")

        // Try to use fallback data if fetch fails
        if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
          console.log("Using fallback assessment data due to fetch error")
          const courseData = assessmentQuestions.find((c) => c.courseId === courseId)

          if (courseData) {
            setCourseTitle(courseData.courseTitle)

            // Convert the fallback questions to the format expected by the component
            const formattedQuestions = courseData.questions.map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              correct_answer: q.correctAnswer,
            }))

            setQuestions(formattedQuestions)
            setSelectedAnswers(Array(formattedQuestions.length).fill(-1))
            setError("Using offline assessment data. Your results won't be saved to your profile.")
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [courseId, isOpen, user, usingFallbackData])

  // Create sample questions for testing
  const createSampleQuestions = async (courseId: number) => {
    // Sample questions based on course ID
    const sampleQuestions = [
      {
        course_id: courseId,
        question: "What is the time complexity of binary search algorithm?",
        options: JSON.stringify(["O(n)", "O(log n)", "O(n log n)", "O(n²)"]),
        correct_answer: 1,
      },
      {
        course_id: courseId,
        question: "Which of the following is not a divide and conquer algorithm?",
        options: JSON.stringify(["Merge Sort", "Quick Sort", "Bubble Sort", "Binary Search"]),
        correct_answer: 2,
      },
      {
        course_id: courseId,
        question: "What is the worst-case time complexity of quicksort?",
        options: JSON.stringify(["O(n log n)", "O(n²)", "O(n)", "O(log n)"]),
        correct_answer: 1,
      },
      {
        course_id: courseId,
        question: "Which data structure is typically used for implementing priority queues?",
        options: JSON.stringify(["Stack", "Queue", "Heap", "Linked List"]),
        correct_answer: 2,
      },
      {
        course_id: courseId,
        question: "What is the primary goal of dynamic programming?",
        options: JSON.stringify([
          "Reduce time complexity",
          "Optimize memory usage",
          "Solve overlapping subproblems efficiently",
          "All of the above",
        ]),
        correct_answer: 2,
      },
    ]

    // Insert sample questions
    if (!usingFallbackData && supabase) {
      for (const question of sampleQuestions) {
        await supabase.from("questions").insert(question)
      }
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      setIsSubmitting(true)

      // Calculate score
      const calculatedScore = calculateScore()
      const calculatedGrade = getGrade(calculatedScore)

      setScore(calculatedScore)
      setGrade(calculatedGrade)

      // Prepare question results
      const questionResults = questions.map((question, index) => ({
        questionId: question.id,
        topic: `Question ${index + 1}`,
        correct: selectedAnswers[index] === question.correct_answer,
      }))

      // Generate strengths and focus areas
      const { strengths, focusAreas, tips } = generateFeedback(questionResults)

      // Save assessment result to Supabase if not in offline mode
      if (!usingFallbackData && supabase) {
        const { error } = await supabase.from("assessment_results").insert({
          user_id: user.id,
          course_id: courseId,
          score: calculatedScore,
          grade: calculatedGrade,
          question_results: questionResults,
          strengths,
          focus_areas: focusAreas,
          tips,
          completed: true,
          created_at: new Date().toISOString(),
        })

        if (error) {
          throw error
        }
      } else if (usingFallbackData) {
        // Show offline mode message
        toast({
          title: "Offline Mode",
          description: "Your assessment results will be saved when you reconnect to the internet.",
          variant: "default",
        })
      }

      // Show success toast
      toast({
        title: "Assessment Completed",
        description: `Your score: ${calculatedScore}% (${calculatedGrade})`,
        variant: "default",
      })

      setIsSubmitted(true)
    } catch (error: any) {
      console.error("Error saving assessment result:", error)
      toast({
        title: "Error Saving Results",
        description: error.message || "Failed to save your assessment results",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setSelectedAnswers(Array(questions.length).fill(-1))
    setCurrentQuestionIndex(0)
    setIsSubmitted(false)
  }

  const calculateScore = () => {
    let correctAnswers = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++
      }
    })
    return Math.round((correctAnswers / questions.length) * 100)
  }

  const getGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  const generateFeedback = (questionResults: any[]) => {
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
    const strengths: string[] = []
    const focusAreas: { topic: string; description: string }[] = []
    const tips: string[] = []

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

    return { strengths, focusAreas, tips }
  }

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-zinc-900 z-10 flex justify-between items-center p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold text-white">Loading Assessment...</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 text-red-500 animate-spin mr-2" />
            <span className="text-zinc-400">Loading questions...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-zinc-900 z-10 flex justify-between items-center p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold text-white">Assessment Error</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-6">
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error Loading Assessment</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isPassed = score >= 80

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 z-10 flex justify-between items-center p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{courseTitle} Assessment</h2>
            {usingFallbackData && (
              <p className="text-yellow-500 text-sm">Offline mode - Results won't be saved to your profile</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6">
          {error && questions.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-md mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <div className="flex gap-2">
                    {Array.from({ length: questions.length }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          selectedAnswers[index] !== -1
                            ? "bg-red-500"
                            : index === currentQuestionIndex
                              ? "bg-zinc-400"
                              : "bg-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-medium text-white mb-6">{questions[currentQuestionIndex]?.question}</h3>

                <div className="space-y-4">
                  {questions[currentQuestionIndex]?.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? "border-red-500 bg-red-500/10"
                          : "border-zinc-700 hover:border-zinc-600"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? "border-red-500 bg-red-500"
                            : "border-zinc-500"
                        }`}
                      >
                        {selectedAnswers[currentQuestionIndex] === index && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-white">{option}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600"
                >
                  Previous
                </Button>
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswers.includes(-1) || isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestionIndex] === -1}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Next
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <div className="text-center p-6 rounded-lg border border-zinc-800 bg-zinc-900">
                <h3 className="text-2xl font-bold mb-2">
                  {isPassed ? (
                    <span className="text-green-500">You have passed the assessment!</span>
                  ) : (
                    <span className="text-red-500">You did not pass the assessment</span>
                  )}
                </h3>
                <div className="text-4xl font-bold mb-4">
                  Score: {score.toFixed(0)}% <span className="text-xl">({grade})</span>
                </div>
                <div className="flex justify-center">
                  {isPassed ? (
                    <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
                      Return to Dashboard
                    </Button>
                  ) : (
                    <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700 text-white">
                      Retry Assessment
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-bold text-white">Review Your Answers</h3>
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="p-6 rounded-lg border border-zinc-800">
                    <h4 className="text-lg font-medium text-white mb-4">
                      {qIndex + 1}. {question.question}
                    </h4>
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`flex items-center p-3 rounded-lg ${
                            question.correct_answer === oIndex
                              ? "bg-green-500/20 border border-green-500"
                              : selectedAnswers[qIndex] === oIndex &&
                                  selectedAnswers[qIndex] !== question.correct_answer
                                ? "bg-red-500/20 border border-red-500"
                                : "bg-zinc-800/50 border border-zinc-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              question.correct_answer === oIndex
                                ? "border-green-500 bg-green-500"
                                : selectedAnswers[qIndex] === oIndex
                                  ? "border-red-500 bg-red-500"
                                  : "border-zinc-500"
                            }`}
                          >
                            {(question.correct_answer === oIndex || selectedAnswers[qIndex] === oIndex) && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-white">{option}</span>
                          {question.correct_answer === oIndex && (
                            <span className="ml-auto text-green-500 text-sm">Correct Answer</span>
                          )}
                          {selectedAnswers[qIndex] === oIndex &&
                            selectedAnswers[qIndex] !== question.correct_answer && (
                              <span className="ml-auto text-red-500 text-sm">Your Answer</span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                {isPassed ? (
                  <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
                    Return to Dashboard
                  </Button>
                ) : (
                  <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700 text-white">
                    Retry Assessment
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
