"use client"

export interface VideoModule {
  id: string
  title: string
  duration: string
  videoUrl: string
  description: string
}

export interface CourseContent {
  courseId: number
  courseTitle: string
  modules: VideoModule[]
}

export const courseVideos: CourseContent[] = [
  {
    courseId: 1,
    courseTitle: "Design & Analysis of Algorithms",
    modules: [
      {
        id: "daa-1",
        title: "Introduction to Algorithm Analysis",
        duration: "12:45",
        videoUrl: "https://www.youtube.com/embed/0IAPZzGSbME",
        description: `
          # Introduction to Algorithm Analysis
          
          This lecture covers the fundamental concepts of algorithm analysis, including:
          
          - Big O notation and its importance
          - Time and space complexity
          - Best, average, and worst-case analysis
          - How to analyze recursive algorithms
          
          ## Key Takeaways
          
          1. Algorithm analysis helps us predict the performance of algorithms
          2. Big O notation describes the upper bound of an algorithm's running time
          3. We typically focus on worst-case analysis for reliability
          4. Different algorithms can solve the same problem with vastly different efficiencies
          
          ## Practice Problems
          
          1. Calculate the time complexity of a simple loop
          2. Determine the space complexity of a recursive function
          3. Compare the efficiency of two sorting algorithms
        `,
      },
      {
        id: "daa-2",
        title: "Divide and Conquer Algorithms",
        duration: "15:30",
        videoUrl: "https://www.youtube.com/embed/2Rr2tW9zvRg",
        description: `
          # Divide and Conquer Algorithms
          
          This lecture explores the divide and conquer paradigm, a powerful algorithm design technique.
          
          ## Topics Covered
          
          - The three steps: divide, conquer, and combine
          - Binary search implementation and analysis
          - Merge sort and its time complexity
          - Quick sort and partition strategies
          - The master theorem for solving recurrences
          
          ## Applications
          
          - Sorting large datasets efficiently
          - Searching in logarithmic time
          - Matrix multiplication optimization
          - Closest pair of points problem
          
          ## Practice Exercise
          
          Implement merge sort and analyze its performance on different input sizes.
        `,
      },
      {
        id: "daa-3",
        title: "Dynamic Programming",
        duration: "18:20",
        videoUrl: "https://www.youtube.com/embed/oBt53YbR9Kk",
        description: `
          # Dynamic Programming
          
          Dynamic Programming (DP) is an algorithmic technique for solving complex problems by breaking them down into simpler subproblems.
          
          ## Key Concepts
          
          - Overlapping subproblems
          - Optimal substructure
          - Memoization vs. tabulation
          - Bottom-up vs. top-down approaches
          
          ## Classic DP Problems
          
          1. Fibonacci sequence
          2. Knapsack problem
          3. Longest common subsequence
          4. Matrix chain multiplication
          
          ## Implementation Strategies
          
          - Identify if a problem has optimal substructure
          - Define the state clearly
          - Establish the recurrence relation
          - Determine the base cases
          - Decide between memoization and tabulation
          
          ## Time and Space Complexity
          
          DP typically reduces exponential time complexity to polynomial time at the cost of additional space.
        `,
      },
      {
        id: "daa-4",
        title: "Greedy Algorithms",
        duration: "14:15",
        videoUrl: "https://www.youtube.com/embed/HzeK7g8cD0Y",
        description: `
          # Greedy Algorithms
          
          Greedy algorithms make locally optimal choices at each step with the hope of finding a global optimum.
          
          ## Characteristics
          
          - Makes the best choice at the moment
          - Never reconsiders previous choices
          - Simple and efficient implementation
          - May not always yield optimal solutions
          
          ## Common Greedy Algorithms
          
          - Huffman coding for data compression
          - Dijkstra's algorithm for shortest paths
          - Kruskal's and Prim's algorithms for minimum spanning trees
          - Activity selection problem
          
          ## When to Use Greedy Algorithms
          
          - Problems with greedy choice property
          - Problems with optimal substructure
          - When local optimum leads to global optimum
          
          ## Advantages and Limitations
          
          Greedy algorithms are typically faster than dynamic programming but don't always guarantee optimal solutions.
        `,
      },
      {
        id: "daa-5",
        title: "Graph Algorithms",
        duration: "20:10",
        videoUrl: "https://www.youtube.com/embed/tWVWeAqZ0WU",
        description: `
          # Graph Algorithms
          
          This lecture covers fundamental algorithms for working with graph data structures.
          
          ## Graph Representations
          
          - Adjacency matrix
          - Adjacency list
          - Edge list
          
          ## Traversal Algorithms
          
          - Breadth-First Search (BFS)
          - Depth-First Search (DFS)
          - Applications and time complexity
          
          ## Shortest Path Algorithms
          
          - Dijkstra's algorithm
          - Bellman-Ford algorithm
          - Floyd-Warshall algorithm
          
          ## Minimum Spanning Trees
          
          - Kruskal's algorithm
          - Prim's algorithm
          
          ## Advanced Topics
          
          - Strongly connected components
          - Topological sorting
          - Network flow problems
          
          ## Practice Problems
          
          Implement BFS and DFS for a given graph and analyze their behavior.
        `,
      },
    ],
  },
  {
    courseId: 2,
    courseTitle: "Data Structures & Algorithms",
    modules: [
      {
        id: "dsa-1",
        title: "Arrays and Linked Lists",
        duration: "14:30",
        videoUrl: "https://www.youtube.com/embed/zg9ih6SVACc",
        description: `
          # Arrays and Linked Lists
          
          This lecture covers the fundamental linear data structures: arrays and linked lists.
          
          ## Arrays
          
          - Static vs. dynamic arrays
          - Random access and time complexity
          - Memory layout and cache efficiency
          - Common operations and their complexity
          
          ## Linked Lists
          
          - Singly linked lists
          - Doubly linked lists
          - Circular linked lists
          - Implementation techniques
          
          ## Comparison
          
          | Operation | Array | Linked List |
          |-----------|-------|-------------|
          | Access    | O(1)  | O(n)        |
          | Insert    | O(n)  | O(1)        |
          | Delete    | O(n)  | O(1)        |
          | Search    | O(n)  | O(n)        |
          
          ## Applications
          
          - Arrays: When random access is frequent
          - Linked Lists: When insertions/deletions are frequent
          
          ## Practice Exercise
          
          Implement a doubly linked list with insertion and deletion operations.
        `,
      },
      {
        id: "dsa-2",
        title: "Stacks and Queues",
        duration: "12:15",
        videoUrl: "https://www.youtube.com/embed/wjI1WNcIntg",
        description: `
          # Stacks and Queues
          
          This lecture explores two fundamental abstract data types: stacks and queues.
          
          ## Stacks
          
          - LIFO (Last In, First Out) principle
          - Push and pop operations
          - Implementation using arrays and linked lists
          - Applications: function calls, expression evaluation, backtracking
          
          ## Queues
          
          - FIFO (First In, First Out) principle
          - Enqueue and dequeue operations
          - Implementation using arrays and linked lists
          - Circular queues to optimize space
          
          ## Variations
          
          - Priority queues
          - Double-ended queues (deques)
          - Implementation considerations
          
          ## Common Applications
          
          - Stacks: Browser history, undo functionality, syntax parsing
          - Queues: Job scheduling, breadth-first search, buffering
          
          ## Practice Problems
          
          1. Implement a stack to check for balanced parentheses
          2. Use a queue to implement level-order traversal of a tree
        `,
      },
      {
        id: "dsa-3",
        title: "Trees and Binary Search Trees",
        duration: "16:45",
        videoUrl: "https://www.youtube.com/embed/fAAZixBzIAI",
        description: `
          # Trees and Binary Search Trees
          
          This lecture covers hierarchical data structures, focusing on trees and binary search trees.
          
          ## Tree Basics
          
          - Terminology: root, node, leaf, parent, child, height, depth
          - Tree traversals: preorder, inorder, postorder, level-order
          - Implementation strategies
          
          ## Binary Trees
          
          - Properties and types
          - Complete, full, and perfect binary trees
          - Binary tree operations
          
          ## Binary Search Trees (BST)
          
          - BST property: left < node < right
          - Search, insertion, and deletion operations
          - Time complexity analysis
          - Self-balancing BSTs: AVL trees, Red-Black trees
          
          ## Applications
          
          - File systems
          - Database indexing
          - Expression parsing
          - Decision trees
          
          ## Practice Exercise
          
          Implement a binary search tree with insertion and search operations.
        `,
      },
      {
        id: "dsa-4",
        title: "Heaps and Priority Queues",
        duration: "13:20",
        videoUrl: "https://www.youtube.com/embed/t0Cq6tVNRBA",
        description: `
          # Heaps and Priority Queues
          
          This lecture explores heap data structures and their application in priority queues.
          
          ## Heap Properties
          
          - Complete binary tree
          - Heap property (min-heap and max-heap)
          - Array representation of heaps
          
          ## Heap Operations
          
          - Insertion (heapify-up)
          - Extraction (heapify-down)
          - Building a heap from an array
          - Time complexity analysis
          
          ## Priority Queues
          
          - Definition and operations
          - Implementation using heaps
          - Applications in scheduling and graph algorithms
          
          ## Heap Sort
          
          - Algorithm steps
          - Time and space complexity
          - Comparison with other sorting algorithms
          
          ## Advanced Heap Variations
          
          - Binomial heaps
          - Fibonacci heaps
          - d-ary heaps
          
          ## Practice Problems
          
          Implement a min-heap and use it to sort an array of integers.
        `,
      },
      {
        id: "dsa-5",
        title: "Hash Tables",
        duration: "15:10",
        videoUrl: "https://www.youtube.com/embed/shs0KM3wKv8",
        description: `
          # Hash Tables
          
          This lecture covers hash tables, a powerful data structure for efficient lookups.
          
          ## Hash Table Concepts
          
          - Hash functions and their properties
          - Collision resolution strategies
          - Load factor and rehashing
          
          ## Collision Resolution
          
          - Separate chaining (linked lists)
          - Open addressing (linear probing, quadratic probing, double hashing)
          - Comparison of approaches
          
          ## Hash Functions
          
          - Division method
          - Multiplication method
          - Universal hashing
          - Cryptographic hash functions
          
          ## Performance Analysis
          
          - Average case: O(1) for search, insert, delete
          - Worst case: O(n) when many collisions occur
          - Space complexity considerations
          
          ## Applications
          
          - Dictionaries and maps
          - Database indexing
          - Caching
          - Symbol tables in compilers
          
          ## Practice Exercise
          
          Implement a hash table with separate chaining for collision resolution.
        `,
      },
    ],
  },
  {
    courseId: 3,
    courseTitle: "Web Development",
    modules: [
      {
        id: "web-1",
        title: "HTML Fundamentals",
        duration: "10:15",
        videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU",
        description: `
          # HTML Fundamentals
          
          This lecture covers the essential elements of HTML (Hypertext Markup Language).
          
          ## HTML Basics
          
          - Document structure
          - Tags, elements, and attributes
          - Semantic HTML5 elements
          - Forms and input types
          
          ## Document Structure
          
          \`\`\`html
          <!DOCTYPE html>
          <html>
            <head>
              <title>Page Title</title>
              <meta charset="UTF-8">
            </head>
            <body>
              <h1>My First Heading</h1>
              <p>My first paragraph.</p>
            </body>
          </html>
          \`\`\`
          
          ## Semantic Elements
          
          - \`<header>\`, \`<footer>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`
          - Importance for accessibility and SEO
          
          ## Forms and Inputs
          
          - Form structure and attributes
          - Input types: text, password, checkbox, radio, etc.
          - Form validation
          
          ## Best Practices
          
          - Use semantic elements
          - Ensure proper nesting
          - Maintain clean, readable code
          - Validate your HTML
          
          ## Practice Exercise
          
          Create a simple registration form with various input types and proper semantic structure.
        `,
      },
      {
        id: "web-2",
        title: "CSS Styling and Layout",
        duration: "13:45",
        videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc",
        description: `
          # CSS Styling and Layout
          
          This lecture covers Cascading Style Sheets (CSS) for styling web pages.
          
          ## CSS Basics
          
          - Selectors and specificity
          - Box model (margin, border, padding, content)
          - Colors, typography, and backgrounds
          - Units (px, em, rem, %, vh/vw)
          
          ## CSS Selectors
          
          \`\`\`css
          /* Element selector */
          p { color: blue; }
          
          /* Class selector */
          .highlight { background-color: yellow; }
          
          /* ID selector */
          #header { font-size: 24px; }
          
          /* Combinators */
          div > p { margin-left: 20px; }
          \`\`\`
          
          ## Layout Techniques
          
          - Display properties (block, inline, flex, grid)
          - Positioning (static, relative, absolute, fixed)
          - Flexbox for one-dimensional layouts
          - CSS Grid for two-dimensional layouts
          
          ## Responsive Design
          
          - Media queries
          - Mobile-first approach
          - Viewport settings
          - Fluid layouts and images
          
          ## CSS Preprocessors
          
          - SASS/SCSS
          - Variables and mixins
          - Nesting and partials
          
          ## Practice Exercise
          
          Create a responsive navigation bar using flexbox that collapses into a hamburger menu on mobile devices.
        `,
      },
      {
        id: "web-3",
        title: "JavaScript Basics",
        duration: "16:30",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        description: `
          # JavaScript Basics
          
          This lecture introduces JavaScript, the programming language of the web.
          
          ## JavaScript Fundamentals
          
          - Variables and data types
          - Operators and expressions
          - Control structures (if, switch, loops)
          - Functions and scope
          
          ## Variables and Data Types
          
          \`\`\`javascript
          // Variables
          let name = "John";
          const age = 30;
          var isStudent = true;
          
          // Data types
          // String, Number, Boolean, null, undefined, Symbol, Object
          \`\`\`
          
          ## Functions
          
          - Function declarations vs. expressions
          - Arrow functions
          - Parameters and return values
          - Higher-order functions
          
          ## DOM Manipulation
          
          - Selecting elements
          - Modifying content and attributes
          - Event handling
          - Creating and removing elements
          
          ## Asynchronous JavaScript
          
          - Callbacks
          - Promises
          - Async/await
          - Fetch API
          
          ## Practice Exercise
          
          Create a simple to-do list application that allows adding, completing, and removing tasks.
        `,
      },
      {
        id: "web-4",
        title: "Frontend Frameworks: React",
        duration: "18:20",
        videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
        description: `
          # Frontend Frameworks: React
          
          This lecture introduces React, a popular JavaScript library for building user interfaces.
          
          ## React Fundamentals
          
          - Components and props
          - State and lifecycle
          - JSX syntax
          - Virtual DOM
          
          ## Component Types
          
          - Functional components
          - Class components
          - Hooks in functional components
          
          ## State Management
          
          - useState and useEffect hooks
          - Context API
          - Redux for larger applications
          
          ## Example Component
          
          \`\`\`jsx
          function Counter() {
            const [count, setCount] = useState(0);
            
            return (
              <div>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                  Click me
                </button>
              </div>
            );
          }
          \`\`\`
          
          ## Routing in React
          
          - React Router
          - Navigation and route parameters
          - Protected routes
          
          ## Best Practices
          
          - Component composition
          - Lifting state up
          - Controlled components
          - Performance optimization
          
          ## Practice Exercise
          
          Build a simple blog application with React components and React Router.
        `,
      },
      {
        id: "web-5",
        title: "Backend Development with Node.js",
        duration: "17:15",
        videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4",
        description: `
          # Backend Development with Node.js
          
          This lecture covers server-side JavaScript using Node.js.
          
          ## Node.js Basics
          
          - Event-driven architecture
          - Non-blocking I/O model
          - npm (Node Package Manager)
          - CommonJS modules
          
          ## Creating a Server
          
          \`\`\`javascript
          const http = require('http');
          
          const server = http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Hello World');
          });
          
          server.listen(3000, () => {
            console.log('Server running at http://localhost:3000/');
          });
          \`\`\`
          
          ## Express.js Framework
          
          - Routing
          - Middleware
          - Request and response objects
          - Template engines
          
          ## RESTful API Development
          
          - HTTP methods (GET, POST, PUT, DELETE)
          - Route parameters and query strings
          - JSON responses
          - Error handling
          
          ## Database Integration
          
          - MongoDB with Mongoose
          - SQL databases with Sequelize
          - CRUD operations
          
          ## Authentication
          
          - JWT (JSON Web Tokens)
          - Passport.js
          - OAuth
          
          ## Practice Exercise
          
          Create a RESTful API for a simple blog with CRUD operations using Express and MongoDB.
        `,
      },
    ],
  },
  {
    courseId: 4,
    courseTitle: "Machine Learning",
    modules: [
      {
        id: "ml-1",
        title: "Introduction to Machine Learning",
        duration: "15:30",
        videoUrl: "https://www.youtube.com/embed/JcI5Vnw0b2c",
        description: `
          # Introduction to Machine Learning
          
          This lecture provides an overview of machine learning concepts and applications.
          
          ## What is Machine Learning?
          
          - Definition and key concepts
          - Types of machine learning
          - Historical development
          - Current applications
          
          ## Types of Machine Learning
          
          1. **Supervised Learning**
             - Classification
             - Regression
             - Examples: spam detection, price prediction
          
          2. **Unsupervised Learning**
             - Clustering
             - Dimensionality reduction
             - Examples: customer segmentation, feature extraction
          
          3. **Reinforcement Learning**
             - Learning through interaction
             - Reward-based learning
             - Examples: game playing, robotics
          
          ## The Machine Learning Pipeline
          
          - Data collection and preparation
          - Feature engineering
          - Model selection and training
          - Evaluation and deployment
          
          ## Challenges in Machine Learning
          
          - Overfitting and underfitting
          - Bias-variance tradeoff
          - Data quality and quantity
          - Ethical considerations
          
          ## Practice Exercise
          
          Identify potential machine learning applications in your field of interest and classify them by type.
        `,
      },
      {
        id: "ml-2",
        title: "Supervised Learning: Classification",
        duration: "17:45",
        videoUrl: "https://www.youtube.com/embed/JcI5Vnw0b2c",
        description: `
          # Supervised Learning: Classification
          
          This lecture covers classification algorithms in supervised learning.
          
          ## Classification Basics
          
          - Binary vs. multi-class classification
          - Feature representation
          - Decision boundaries
          - Evaluation metrics
          
          ## Common Classification Algorithms
          
          1. **Logistic Regression**
             - Linear model for classification
             - Sigmoid function
             - Maximum likelihood estimation
          
          2. **Decision Trees**
             - Tree-based learning
             - Information gain and Gini impurity
             - Pruning techniques
          
          3. **Support Vector Machines (SVM)**
             - Maximal margin classifier
             - Kernel trick for non-linear boundaries
             - Soft margin classification
          
          4. **k-Nearest Neighbors (k-NN)**
             - Instance-based learning
             - Distance metrics
             - Choosing the optimal k
          
          5. **Naive Bayes**
             - Probabilistic classifier
             - Bayes' theorem
             - Independence assumption
          
          ## Evaluation Metrics
          
          - Accuracy, precision, recall, F1-score
          - Confusion matrix
          - ROC curve and AUC
          - Cross-validation
          
          ## Practice Exercise
          
          Implement a binary classifier using scikit-learn and evaluate its performance using appropriate metrics.
        `,
      },
      {
        id: "ml-3",
        title: "Supervised Learning: Regression",
        duration: "16:15",
        videoUrl: "https://www.youtube.com/embed/JcI5Vnw0b2c",
        description: `
          # Supervised Learning: Regression
          
          This lecture covers regression algorithms for predicting continuous values.
          
          ## Regression Basics
          
          - Predicting continuous values
          - Linear vs. non-linear regression
          - Feature scaling and normalization
          - Bias-variance tradeoff
          
          ## Linear Regression
          
          - Simple linear regression
          - Multiple linear regression
          - Ordinary least squares (OLS)
          - Gradient descent optimization
          
          ## Beyond Linear Regression
          
          1. **Polynomial Regression**
             - Modeling non-linear relationships
             - Feature transformation
             - Overfitting concerns
          
          2. **Ridge and Lasso Regression**
             - L1 and L2 regularization
             - Handling multicollinearity
             - Feature selection with Lasso
          
          3. **Decision Tree Regression**
             - Non-parametric approach
             - Handling non-linear relationships
             - Ensemble methods (Random Forest, Gradient Boosting)
          
          ## Evaluation Metrics
          
          - Mean Squared Error (MSE)
          - Root Mean Squared Error (RMSE)
          - Mean Absolute Error (MAE)
          - R-squared and Adjusted R-squared
          
          ## Practice Exercise
          
          Implement a regression model to predict housing prices based on features like size, location, and amenities.
        `,
      },
      {
        id: "ml-4",
        title: "Neural Networks and Deep Learning",
        duration: "19:30",
        videoUrl: "https://www.youtube.com/embed/CS4cs9xpXxE",
        description: `
          # Neural Networks and Deep Learning
          
          This lecture introduces artificial neural networks and deep learning concepts.
          
          ## Neural Network Fundamentals
          
          - Biological inspiration
          - Neurons and activation functions
          - Feedforward networks
          - Backpropagation algorithm
          
          ## Network Architecture
          
          - Input, hidden, and output layers
          - Layer types (dense, convolutional, recurrent)
          - Activation functions (ReLU, sigmoid, tanh)
          - Loss functions and optimizers
          
          ## Deep Learning
          
          - From shallow to deep networks
          - Vanishing/exploding gradients
          - Regularization techniques (dropout, batch normalization)
          - Transfer learning
          
          ## Convolutional Neural Networks (CNNs)
          
          - Convolutional layers
          - Pooling operations
          - Image classification and object detection
          - Popular architectures (AlexNet, VGG, ResNet)
          
          ## Recurrent Neural Networks (RNNs)
          
          - Sequential data processing
          - Long Short-Term Memory (LSTM)
          - Gated Recurrent Units (GRU)
          - Applications in NLP and time series
          
          ## Practice Exercise
          
          Build a simple neural network for digit recognition using the MNIST dataset.
        `,
      },
      {
        id: "ml-5",
        title: "Unsupervised Learning",
        duration: "14:45",
        videoUrl: "https://www.youtube.com/embed/IUn8k5zSI6g",
        description: `
          # Unsupervised Learning
          
          This lecture covers unsupervised learning techniques for discovering patterns in data.
          
          ## Clustering Algorithms
          
          1. **K-means Clustering**
             - Algorithm steps
             - Centroid initialization
             - Determining optimal k (elbow method)
             - Limitations and variations
          
          2. **Hierarchical Clustering**
             - Agglomerative vs. divisive
             - Linkage criteria
             - Dendrogram visualization
             - Cutting the dendrogram
          
          3. **DBSCAN**
             - Density-based clustering
             - Core points, border points, and noise
             - Advantages over centroid-based methods
          
          ## Dimensionality Reduction
          
          1. **Principal Component Analysis (PCA)**
             - Variance maximization
             - Eigenvalues and eigenvectors
             - Selecting number of components
             - Applications in visualization
          
          2. **t-SNE**
             - Non-linear dimensionality reduction
             - Preserving local structure
             - Visualization of high-dimensional data
          
          3. **Autoencoders**
             - Neural network approach
             - Encoder-decoder architecture
             - Latent space representation
          
          ## Applications
          
          - Customer segmentation
          - Anomaly detection
          - Feature extraction
          - Data visualization
          
          ## Practice Exercise
          
          Apply k-means clustering to segment customers based on purchasing behavior.
        `,
      },
    ],
  },
  {
    courseId: 5,
    courseTitle: "Cloud Computing",
    modules: [
      {
        id: "cloud-1",
        title: "Introduction to Cloud Computing",
        duration: "12:30",
        videoUrl: "https://www.youtube.com/embed/M988_fsOSWo",
        description: `
          # Introduction to Cloud Computing
          
          This lecture provides an overview of cloud computing concepts and services.
          
          ## What is Cloud Computing?
          
          - Definition and key characteristics
          - Evolution from traditional computing
          - Business benefits
          - Concerns and challenges
          
          ## Cloud Service Models
          
          1. **Infrastructure as a Service (IaaS)**
             - Virtual machines and storage
             - Network components
             - Examples: AWS EC2, Azure VMs
          
          2. **Platform as a Service (PaaS)**
             - Development and deployment environment
             - Middleware and runtime
             - Examples: Heroku, Google App Engine
          
          3. **Software as a Service (SaaS)**
             - End-user applications
             - Subscription-based model
             - Examples: Salesforce, Microsoft 365
          
          ## Deployment Models
          
          - Public cloud
          - Private cloud
          - Hybrid cloud
          - Multi-cloud
          
          ## Key Cloud Providers
          
          - Amazon Web Services (AWS)
          - Microsoft Azure
          - Google Cloud Platform (GCP)
          - IBM Cloud
          
          ## Practice Exercise
          
          Identify which cloud service model would be most appropriate for different business scenarios.
        `,
      },
      {
        id: "cloud-2",
        title: "AWS Fundamentals",
        duration: "16:45",
        videoUrl: "https://www.youtube.com/embed/ulprqHHWlng",
        description: `
          # AWS Fundamentals
          
          This lecture introduces Amazon Web Services (AWS), a leading cloud platform.
          
          ## AWS Overview
          
          - Global infrastructure
          - Regions and Availability Zones
          - AWS Management Console
          - AWS CLI and SDKs
          
          ## Core AWS Services
          
          1. **Compute Services**
             - EC2 (Elastic Compute Cloud)
             - Lambda (Serverless)
             - ECS/EKS (Container services)
          
          2. **Storage Services**
             - S3 (Simple Storage Service)
             - EBS (Elastic Block Store)
             - Glacier (Archival storage)
          
          3. **Database Services**
             - RDS (Relational Database Service)
             - DynamoDB (NoSQL)
             - Redshift (Data warehouse)
          
          4. **Networking**
             - VPC (Virtual Private Cloud)
             - Route 53 (DNS)
             - CloudFront (CDN)
          
          ## Security in AWS
          
          - IAM (Identity and Access Management)
          - Security groups and NACLs
          - AWS Shield and WAF
          - Encryption options
          
          ## AWS Pricing Model
          
          - Pay-as-you-go
          - Reserved Instances
          - Spot Instances
          - Free Tier
          
          ## Practice Exercise
          
          Set up a simple web application using EC2, S3, and RDS to understand how these services interact.
        `,
      },
      {
        id: "cloud-3",
        title: "Cloud Architecture and Design",
        duration: "15:20",
        videoUrl: "https://www.youtube.com/embed/a9__D53WsUs",
        description: `
          # Cloud Architecture and Design
          
          This lecture covers principles and patterns for designing cloud-native applications.
          
          ## Cloud Architecture Principles
          
          - Scalability and elasticity
          - High availability and fault tolerance
          - Security by design
          - Cost optimization
          
          ## Design Patterns
          
          1. **Microservices Architecture**
             - Service decomposition
             - API gateways
             - Service discovery
             - Containerization
          
          2. **Serverless Architecture**
             - Function as a Service (FaaS)
             - Event-driven design
             - Benefits and limitations
             - Use cases
          
          3. **Event-Driven Architecture**
             - Pub/sub model
             - Message queues
             - Event processing
             - Decoupling services
          
          ## Well-Architected Framework
          
          - Operational excellence
          - Security
          - Reliability
          - Performance efficiency
          - Cost optimization
          
          ## Infrastructure as Code (IaC)
          
          - AWS CloudFormation
          - Terraform
          - Benefits of declarative infrastructure
          - Version control for infrastructure
          
          ## Practice Exercise
          
          Design a highly available, scalable architecture for a web application with database backend.
        `,
      },
      {
        id: "cloud-4",
        title: "DevOps in the Cloud",
        duration: "14:10",
        videoUrl: "https://www.youtube.com/embed/0yWAtQ6wYNM",
        description: `
          # DevOps in the Cloud
          
          This lecture explores DevOps practices and tools in cloud environments.
          
          ## DevOps Fundamentals
          
          - DevOps culture and principles
          - Continuous Integration (CI)
          - Continuous Delivery/Deployment (CD)
          - Infrastructure as Code (IaC)
          
          ## CI/CD Pipeline
          
          - Source control (Git)
          - Build automation
          - Test automation
          - Deployment automation
          
          ## Cloud DevOps Tools
          
          1. **AWS DevOps Services**
             - CodeCommit, CodeBuild, CodeDeploy
             - CodePipeline
             - CloudFormation
          
          2. **Azure DevOps**
             - Azure Repos, Pipelines
             - Azure Artifacts
             - Azure Resource Manager templates
          
          3. **Third-party Tools**
             - Jenkins
             - GitLab CI/CD
             - GitHub Actions
             - Terraform
          
          ## Monitoring and Observability
          
          - CloudWatch and CloudTrail
          - Application Insights
          - Logging and metrics
          - Alerting and incident response
          
          ## Container Orchestration
          
          - Kubernetes
          - Amazon EKS/ECS
          - Azure Kubernetes Service
          - Google Kubernetes Engine
          
          ## Practice Exercise
          
          Set up a CI/CD pipeline for a simple application using AWS CodePipeline or GitHub Actions.
        `,
      },
      {
        id: "cloud-5",
        title: "Cloud Security and Compliance",
        duration: "17:30",
        videoUrl: "https://www.youtube.com/embed/QYzVZ_gQjj4",
        description: `
          # Cloud Security and Compliance
          
          This lecture covers security considerations and compliance in cloud environments.
          
          ## Shared Responsibility Model
          
          - Provider vs. customer responsibilities
          - Service model differences (IaaS, PaaS, SaaS)
          - Security "of" the cloud vs. security "in" the cloud
          
          ## Identity and Access Management
          
          - Authentication and authorization
          - Role-based access control (RBAC)
          - Multi-factor authentication (MFA)
          - Single sign-on (SSO)
          
          ## Data Protection
          
          - Encryption at rest and in transit
          - Key management
          - Data classification
          - Data loss prevention (DLP)
          
          ## Network Security
          
          - Virtual private clouds (VPCs)
          - Security groups and NACLs
          - Web application firewalls (WAF)
          - DDoS protection
          
          ## Compliance Frameworks
          
          - GDPR (General Data Protection Regulation)
          - HIPAA (Health Insurance Portability and Accountability Act)
          - PCI DSS (Payment Card Industry Data Security Standard)
          - SOC 2 (Service Organization Control 2)
          
          ## Security Best Practices
          
          - Principle of least privilege
          - Regular security assessments
          - Automated compliance checks
          - Incident response planning
          
          ## Practice Exercise
          
          Implement a secure cloud architecture that meets compliance requirements for a financial application.
        `,
      },
    ],
  },
]
