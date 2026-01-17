export interface Project {
  id: string;
  codename: string;
  title: string;
  status: "DEPLOYED" | "IN_PROGRESS" | "ARCHIVED";
  classification: string;
  glitch: string; // The problem/challenge
  patch: string; // The solution
  efficiency: string; // The result/impact
  stack: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "SYS-001",
    codename: "CORTEX",
    title: "AI-Powered Document Processing Pipeline",
    status: "DEPLOYED",
    classification: "MACHINE LEARNING",
    glitch: "Manual document processing causing 72-hour delays in enterprise workflow",
    patch: "Built end-to-end ML pipeline with OCR, NLP classification, and automated routing using transformer models",
    efficiency: "Reduced processing time from 72hrs to 4min. 99.2% accuracy on classification tasks",
    stack: ["Python", "PyTorch", "FastAPI", "Redis", "PostgreSQL", "Docker", "AWS Lambda"],
    metrics: [
      { label: "Processing Time", value: "-99.9%" },
      { label: "Accuracy", value: "99.2%" },
      { label: "Documents/Day", value: "50K+" }
    ]
  },
  {
    id: "SYS-002",
    codename: "NEXUS",
    title: "Real-time Recommendation Engine",
    status: "DEPLOYED",
    classification: "DISTRIBUTED SYSTEMS",
    glitch: "Static recommendations failing to capture user intent, low engagement rates",
    patch: "Implemented hybrid collaborative filtering with real-time feature store and A/B testing framework",
    efficiency: "Increased CTR by 340%. Reduced latency from 200ms to 12ms p99",
    stack: ["Go", "Apache Kafka", "Redis", "TensorFlow Serving", "Kubernetes", "Prometheus"],
    metrics: [
      { label: "CTR Increase", value: "+340%" },
      { label: "Latency p99", value: "12ms" },
      { label: "Daily Users", value: "2M+" }
    ]
  },
  {
    id: "SYS-003",
    codename: "SENTINEL",
    title: "Anomaly Detection & Alert System",
    status: "DEPLOYED",
    classification: "MLOPS / MONITORING",
    glitch: "Critical infrastructure failures going undetected for hours, causing cascading outages",
    patch: "Designed multi-model ensemble with LSTM autoencoders for time-series anomaly detection",
    efficiency: "Detected 94% of incidents before user impact. MTTR reduced by 67%",
    stack: ["Python", "Keras", "Apache Flink", "InfluxDB", "Grafana", "PagerDuty API"],
    metrics: [
      { label: "Detection Rate", value: "94%" },
      { label: "MTTR Reduction", value: "-67%" },
      { label: "False Positives", value: "<2%" }
    ]
  },
  {
    id: "SYS-004",
    codename: "ORACLE",
    title: "Conversational AI Assistant Platform",
    status: "IN_PROGRESS",
    classification: "LLM / NLP",
    glitch: "Customer support overwhelmed with repetitive queries, 45min average response time",
    patch: "Building RAG-based assistant with fine-tuned LLM, semantic search, and human-in-the-loop escalation",
    efficiency: "Target: 80% query resolution without human intervention",
    stack: ["Python", "LangChain", "OpenAI API", "Pinecone", "Next.js", "WebSocket"],
    metrics: [
      { label: "Auto-Resolution", value: "80%" },
      { label: "Response Time", value: "<3s" },
      { label: "Satisfaction", value: "4.8/5" }
    ]
  }
];

export const skills = {
  languages: ["Python", "TypeScript", "Go", "Rust", "SQL"],
  ml: ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face", "LangChain"],
  infrastructure: ["Kubernetes", "Docker", "Terraform", "AWS", "GCP"],
  data: ["PostgreSQL", "Redis", "Kafka", "Elasticsearch", "Pinecone"],
  practices: ["MLOps", "CI/CD", "System Design", "API Design", "Observability"]
};

export const profile = {
  name: "Kevin Narvaez",
  role: "AI Product System Engineer",
  location: "Ecuador",
  bio: "I architect the bridge between AI research and production systems. With a background in distributed systems and machine learning, I specialize in taking models from notebook to scale—building the infrastructure that turns AI potential into business impact.",
  years: 5,
  email: "contact@knarvaez.com",
  github: "https://github.com/knarvaez",
  linkedin: "https://linkedin.com/in/knarvaez"
};
