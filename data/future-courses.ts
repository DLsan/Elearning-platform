export interface FutureCourse {
  id: number
  title: string
  code: string
  difficulty: string
  description: string
  enrolled: boolean
}

// Initial future courses data
export const futureCourses: FutureCourse[] = [
  {
    id: 101,
    title: "Artificial Intelligence",
    code: "AI",
    difficulty: "Advanced",
    description: "Learn about machine learning, neural networks, and AI applications in various industries.",
    enrolled: false,
  },
  {
    id: 102,
    title: "Cyber Security",
    code: "CYSECURITY",
    difficulty: "Intermediate",
    description: "Master security principles, threat detection, and protection strategies for digital systems.",
    enrolled: false,
  },
  {
    id: 103,
    title: "Mobile App Development",
    code: "MAD101",
    difficulty: "Intermediate",
    description: "Build native and cross-platform mobile applications for iOS and Android devices.",
    enrolled: false,
  },
  {
    id: 104,
    title: "Game Development",
    code: "GAMEDEV",
    difficulty: "Intermediate",
    description: "Create interactive games using modern engines and programming techniques.",
    enrolled: false,
  },
  {
    id: 105,
    title: "DevOps",
    code: "DEVOPS",
    difficulty: "Advanced",
    description: "Learn continuous integration, deployment, and infrastructure automation practices.",
    enrolled: false,
  },
  {
    id: 106,
    title: "UI/UX Design",
    code: "UIUX",
    difficulty: "Beginner",
    description: "Master user interface and experience design principles for digital products.",
    enrolled: false,
  },
  {
    id: 107,
    title: "Internet of Things",
    code: "IOT",
    difficulty: "Advanced",
    description: "Explore connected devices, sensors, and IoT architecture and applications.",
    enrolled: false,
  },
]
