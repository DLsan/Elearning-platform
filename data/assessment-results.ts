export interface AssessmentResult {
  courseId: number
  courseTitle: string
  completed: boolean
  score: number
  grade: string
  date?: string
  strengths?: string[]
  focusAreas?: {
    topic: string
    description: string
  }[]
  tips?: string[]
  questionResults?: {
    questionId: number
    topic: string
    correct: boolean
  }[]
}

// Sample data - in a real app, this would come from a database
export const assessmentResults: AssessmentResult[] = [
  {
    courseId: 1,
    courseTitle: "Design & Analysis of Algorithms",
    completed: true,
    score: 85,
    grade: "B",
    date: "2023-11-15",
    strengths: ["Divide and Conquer", "Dynamic Programming"],
    focusAreas: [
      {
        topic: "Graph Algorithms",
        description: "You missed questions related to shortest path algorithms and minimum spanning trees.",
      },
      {
        topic: "NP-Completeness",
        description: "Review the characteristics and examples of NP-complete problems.",
      },
    ],
    tips: [
      "Practice implementing Dijkstra's algorithm and understand its time complexity",
      "Review the differences between greedy algorithms and dynamic programming",
      "Solve more graph traversal problems to strengthen your understanding",
    ],
    questionResults: [
      { questionId: 1, topic: "Time Complexity", correct: true },
      { questionId: 2, topic: "Divide and Conquer", correct: true },
      { questionId: 3, topic: "Time Complexity", correct: false },
      { questionId: 4, topic: "Data Structures", correct: true },
      { questionId: 5, topic: "Dynamic Programming", correct: true },
      { questionId: 6, topic: "Graph Algorithms", correct: false },
      { questionId: 7, topic: "Space Complexity", correct: true },
      { questionId: 8, topic: "NP-Completeness", correct: false },
      { questionId: 9, topic: "Sorting Algorithms", correct: true },
      { questionId: 10, topic: "Algorithm Design", correct: true },
    ],
  },
  {
    courseId: 2,
    courseTitle: "Data Structures & Algorithms",
    completed: true,
    score: 92,
    grade: "A",
    date: "2023-11-10",
    strengths: ["Arrays", "Stacks and Queues", "Sorting Algorithms"],
    focusAreas: [
      {
        topic: "Tree Traversal",
        description: "You had difficulty with tree traversal algorithms, particularly post-order traversal.",
      },
    ],
    tips: [
      "Practice implementing different tree traversal methods (in-order, pre-order, post-order)",
      "Solve more problems involving binary search trees on LeetCode",
      "Review the time and space complexity of different data structures",
    ],
    questionResults: [
      { questionId: 1, topic: "Stacks", correct: true },
      { questionId: 2, topic: "Arrays", correct: true },
      { questionId: 3, topic: "Linear Data Structures", correct: true },
      { questionId: 4, topic: "Binary Search Trees", correct: false },
      { questionId: 5, topic: "Sorting Algorithms", correct: true },
      { questionId: 6, topic: "Stacks", correct: true },
      { questionId: 7, topic: "Linked Lists", correct: true },
      { questionId: 8, topic: "Linked Lists", correct: true },
      { questionId: 9, topic: "Hash Tables", correct: true },
      { questionId: 10, topic: "B-Trees", correct: true },
    ],
  },
  {
    courseId: 3,
    courseTitle: "Web Development",
    completed: true,
    score: 78,
    grade: "C",
    date: "2023-11-05",
    strengths: ["HTML", "CSS Basics"],
    focusAreas: [
      {
        topic: "JavaScript Frameworks",
        description: "You struggled with questions about React and other modern frameworks.",
      },
      {
        topic: "API Integration",
        description: "Review RESTful API concepts and implementation techniques.",
      },
    ],
    tips: [
      "Build a small project using React to reinforce your understanding of components and state",
      "Practice making API calls and handling responses with fetch or axios",
      "Review modern JavaScript features like promises, async/await, and destructuring",
    ],
    questionResults: [
      { questionId: 1, topic: "HTML", correct: true },
      { questionId: 2, topic: "CSS", correct: true },
      { questionId: 3, topic: "API", correct: false },
      { questionId: 4, topic: "JavaScript Frameworks", correct: false },
      { questionId: 5, topic: "Responsive Design", correct: true },
      { questionId: 6, topic: "HTTP", correct: true },
      { questionId: 7, topic: "JavaScript", correct: true },
      { questionId: 8, topic: "CSS", correct: true },
      { questionId: 9, topic: "CORS", correct: false },
      { questionId: 10, topic: "Frontend vs Backend", correct: true },
    ],
  },
  {
    courseId: 4,
    courseTitle: "Machine Learning",
    completed: false,
    score: 0,
    grade: "N/A",
  },
  {
    courseId: 5,
    courseTitle: "Cloud Computing",
    completed: true,
    score: 95,
    grade: "A",
    date: "2023-11-20",
    strengths: ["Cloud Service Models", "AWS Services", "Security"],
    focusAreas: [
      {
        topic: "Containerization",
        description: "You missed a question about container orchestration technologies.",
      },
    ],
    tips: [
      "Experiment with Docker to understand containerization concepts better",
      "Learn the basics of Kubernetes for container orchestration",
      "Practice implementing infrastructure as code using CloudFormation or Terraform",
    ],
    questionResults: [
      { questionId: 1, topic: "Cloud Service Models", correct: true },
      { questionId: 2, topic: "Cloud Benefits", correct: true },
      { questionId: 3, topic: "Deployment Models", correct: true },
      { questionId: 4, topic: "Auto-scaling", correct: true },
      { questionId: 5, topic: "Cloud Providers", correct: true },
      { questionId: 6, topic: "CDN", correct: true },
      { questionId: 7, topic: "Virtualization", correct: true },
      { questionId: 8, topic: "Shared Responsibility", correct: true },
      { questionId: 9, topic: "Cloud Characteristics", correct: true },
      { questionId: 10, topic: "Containerization", correct: false },
    ],
  },
]
