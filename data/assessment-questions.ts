export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number // Index of the correct answer (0-3)
}

export interface CourseAssessment {
  courseId: number
  courseTitle: string
  questions: Question[]
}

export const assessmentQuestions: CourseAssessment[] = [
  {
    courseId: 1,
    courseTitle: "Design & Analysis of Algorithms",
    questions: [
      {
        id: 1,
        question: "What is the time complexity of binary search algorithm?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which of the following is not a divide and conquer algorithm?",
        options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Binary Search"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is the worst-case time complexity of quicksort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Which data structure is typically used for implementing priority queues?",
        options: ["Stack", "Queue", "Heap", "Linked List"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What is the primary goal of dynamic programming?",
        options: [
          "Reduce time complexity",
          "Optimize memory usage",
          "Solve overlapping subproblems efficiently",
          "All of the above",
        ],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: "Which algorithm is used to find the shortest path in a weighted graph?",
        options: ["BFS", "DFS", "Dijkstra's Algorithm", "Binary Search"],
        correctAnswer: 2,
      },
      {
        id: 7,
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: "Which of these is not an NP-complete problem?",
        options: ["Traveling Salesman Problem", "Binary Search", "Knapsack Problem", "Graph Coloring"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "What is the best case time complexity of bubble sort?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctAnswer: 2,
      },
      {
        id: 10,
        question: "Which algorithm design paradigm breaks problems into subproblems and combines their solutions?",
        options: ["Greedy", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
        correctAnswer: 2,
      },
    ],
  },
  {
    courseId: 2,
    courseTitle: "Data Structures & Algorithms",
    questions: [
      {
        id: 1,
        question: "Which data structure follows LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Which of the following is not a linear data structure?",
        options: ["Array", "Linked List", "Queue", "Tree"],
        correctAnswer: 3,
      },
      {
        id: 4,
        question: "What is the worst-case time complexity for searching in a binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "Which sorting algorithm has the best average-case performance?",
        options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: "What data structure would you use to check if a syntax has balanced parentheses?",
        options: ["Queue", "Stack", "Heap", "Linked List"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "Which of these is not an advantage of linked lists over arrays?",
        options: ["Dynamic size", "Ease of insertion/deletion", "Random access", "Memory efficiency"],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: "What is the time complexity of inserting an element at the beginning of a linked list?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 0,
      },
      {
        id: 9,
        question: "Which data structure is best for implementing a dictionary?",
        options: ["Array", "Linked List", "Hash Table", "Stack"],
        correctAnswer: 2,
      },
      {
        id: 10,
        question: "What is the primary advantage of a B-tree over a binary search tree?",
        options: [
          "Faster search times",
          "Better for in-memory operations",
          "Better for disk access patterns",
          "Simpler implementation",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    courseId: 3,
    courseTitle: "Web Development",
    questions: [
      {
        id: 1,
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which CSS property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What does API stand for?",
        options: [
          "Application Programming Interface",
          "Application Process Integration",
          "Automated Programming Interface",
          "Application Protocol Interface",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which of the following is a JavaScript framework?",
        options: ["Django", "Flask", "Ruby on Rails", "React"],
        correctAnswer: 3,
      },
      {
        id: 5,
        question: "What is the purpose of the 'viewport' meta tag in HTML?",
        options: [
          "To define the visible area of a web page",
          "To set the page title",
          "To include external CSS",
          "To define page keywords",
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "Which HTTP status code indicates a successful response?",
        options: ["404", "500", "200", "302"],
        correctAnswer: 2,
      },
      {
        id: 7,
        question: "What is the correct way to include an external JavaScript file?",
        options: [
          "<script href='script.js'>",
          "<script name='script.js'>",
          "<script src='script.js'>",
          "<javascript src='script.js'>",
        ],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: "Which CSS property is used to add space between elements?",
        options: ["spacing", "margin", "padding", "border"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "What does CORS stand for?",
        options: [
          "Cross-Origin Resource Sharing",
          "Create Object Resource System",
          "Cross-Object Response System",
          "Create Origin Response Sharing",
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "Which of the following is NOT a front-end technology?",
        options: ["HTML", "CSS", "JavaScript", "PHP"],
        correctAnswer: 3,
      },
    ],
  },
  {
    courseId: 4,
    courseTitle: "Machine Learning",
    questions: [
      {
        id: 1,
        question: "Which of the following is a supervised learning algorithm?",
        options: ["K-means clustering", "Linear Regression", "Principal Component Analysis", "Autoencoders"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is the purpose of the activation function in neural networks?",
        options: ["To initialize weights", "To introduce non-linearity", "To normalize data", "To reduce overfitting"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which algorithm is commonly used for recommendation systems?",
        options: ["Decision Trees", "Collaborative Filtering", "Support Vector Machines", "Naive Bayes"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does CNN stand for in deep learning?",
        options: [
          "Convolutional Neural Network",
          "Complex Neural Network",
          "Continuous Neural Network",
          "Computational Neural Network",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Which of the following is NOT a common evaluation metric for classification models?",
        options: ["Precision", "Recall", "F1 Score", "Mean Squared Error"],
        correctAnswer: 3,
      },
      {
        id: 6,
        question: "What is the purpose of regularization in machine learning?",
        options: [
          "To increase model complexity",
          "To prevent overfitting",
          "To speed up training",
          "To improve data quality",
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "Which algorithm is best suited for anomaly detection?",
        options: ["Linear Regression", "Logistic Regression", "Isolation Forest", "Decision Trees"],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: "What is the 'curse of dimensionality' in machine learning?",
        options: [
          "Having too few features",
          "Having too many features",
          "Having too few training examples",
          "Having too many training examples",
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "Which of the following is an unsupervised learning task?",
        options: ["Classification", "Regression", "Clustering", "Reinforcement Learning"],
        correctAnswer: 2,
      },
      {
        id: 10,
        question: "What is the purpose of cross-validation in machine learning?",
        options: ["To clean data", "To evaluate model performance", "To visualize results", "To speed up training"],
        correctAnswer: 1,
      },
    ],
  },
  {
    courseId: 5,
    courseTitle: "Cloud Computing",
    questions: [
      {
        id: 1,
        question: "Which of the following is NOT a cloud service model?",
        options: ["IaaS", "PaaS", "SaaS", "DaaS"],
        correctAnswer: 3,
      },
      {
        id: 2,
        question: "What is the main advantage of cloud computing?",
        options: ["Increased security", "Reduced costs", "Better performance", "All of the above"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which cloud deployment model offers the highest level of control?",
        options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Community Cloud"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What is auto-scaling in cloud computing?",
        options: [
          "Automatic backup of data",
          "Automatic resource allocation based on demand",
          "Automatic software updates",
          "Automatic cost optimization",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which of the following is NOT a major cloud service provider?",
        options: ["AWS", "Microsoft Azure", "Google Cloud", "Oracle Database"],
        correctAnswer: 3,
      },
      {
        id: 6,
        question: "What is the primary purpose of a CDN in cloud computing?",
        options: ["Data storage", "Content delivery", "Database management", "User authentication"],
        correctAnswer: 1,
      },
      {
        id: 7,
        question: "Which technology is fundamental to cloud computing virtualization?",
        options: ["Hypervisor", "Blockchain", "Machine Learning", "Internet of Things"],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "What is the 'shared responsibility model' in cloud computing?",
        options: [
          "Cost sharing between providers",
          "Security responsibilities between provider and customer",
          "Resource sharing among users",
          "Profit sharing with stakeholders",
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "Which of the following is a characteristic of cloud computing?",
        options: [
          "On-demand self-service",
          "Limited network access",
          "Fixed resource pooling",
          "Measured service with fixed pricing",
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "What is a container in cloud computing?",
        options: [
          "A storage unit",
          "A lightweight, standalone executable package",
          "A networking protocol",
          "A security measure",
        ],
        correctAnswer: 1,
      },
    ],
  },
]
