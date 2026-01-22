import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Profile
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Kevin Narvaez',
      title: 'AI Product System Engineer',
      bio: 'Architecting the bridge between abstract intelligence and scalable infrastructure. Specialized in high-throughput inference engines and distributed systems.',
      email: 'hello@kevinnarvaez.com',
      location: 'Global / Remote',
      socialLinks: {
        github: 'https://github.com/kevinnarvaez',
        linkedin: 'https://linkedin.com/in/kevinnarvaez',
        twitter: 'https://x.com/kevinnarvaez',
      },
    },
  });

  // 2. Skills
  const skillsData = [
    { name: 'Machine Learning', category: 'AI', level: 95 },
    { name: 'System Architecture', category: 'Backend', level: 92 },
    { name: 'Next.js / React', category: 'Frontend', level: 90 },
    { name: 'NestJS / Node', category: 'Backend', level: 94 },
    { name: 'Kubernetes', category: 'Cloud', level: 88 },
    { name: 'PyTorch', category: 'AI', level: 85 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }

  // 3. Projects
  const projectsData = [
    {
      title: "AI-Powered Document Processing Pipeline",
      description: "Built end-to-end ML pipeline with OCR, NLP classification, and automated routing using transformer models",
      codename: "CORTEX",
      status: "DEPLOYED",
      classification: "MACHINE LEARNING",
      problem: "Manual document processing causing 72-hour delays in enterprise workflow",
      solution: "Built end-to-end ML pipeline with OCR, NLP classification, and automated routing using transformer models",
      impact: "Reduced processing time from 72hrs to 4min. 99.2% accuracy on classification tasks",
      techStack: ["Python", "PyTorch", "FastAPI", "Redis", "PostgreSQL", "Docker", "AWS Lambda"],
      featured: true,
      metrics: [
        { label: "Processing Time", value: "-99.9%" },
        { label: "Accuracy", value: "99.2%" },
        { label: "Documents/Day", value: "50K+" }
      ]
    },
    {
      title: "Real-time Recommendation Engine",
      description: "Implemented hybrid collaborative filtering with real-time feature store and A/B testing framework",
      codename: "NEXUS",
      status: "DEPLOYED",
      classification: "DISTRIBUTED SYSTEMS",
      problem: "Static recommendations failing to capture user intent, low engagement rates",
      solution: "Implemented hybrid collaborative filtering with real-time feature store and A/B testing framework",
      impact: "Increased CTR by 340%. Reduced latency from 200ms to 12ms p99",
      techStack: ["Go", "Apache Kafka", "Redis", "TensorFlow Serving", "Kubernetes", "Prometheus"],
      featured: true,
      metrics: [
        { label: "CTR Increase", value: "+340%" },
        { label: "Latency p99", value: "12ms" },
        { label: "Daily Users", value: "2M+" }
      ]
    },
    {
      title: "Anomaly Detection & Alert System",
      description: "Designed multi-model ensemble with LSTM autoencoders for time-series anomaly detection",
      codename: "SENTINEL",
      status: "DEPLOYED",
      classification: "MLOPS / MONITORING",
      problem: "Critical infrastructure failures going undetected for hours, causing cascading outages",
      solution: "Designed multi-model ensemble with LSTM autoencoders for time-series anomaly detection",
      impact: "Detected 94% of incidents before user impact. MTTR reduced by 67%",
      techStack: ["Python", "Keras", "Apache Flink", "InfluxDB", "Grafana", "PagerDuty API"],
      featured: false,
      metrics: [
        { label: "Detection Rate", value: "94%" },
        { label: "MTTR Reduction", value: "-67%" },
        { label: "False Positives", value: "<2%" }
      ]
    },
    {
      title: "Conversational AI Assistant Platform",
      description: "Building RAG-based assistant with fine-tuned LLM, semantic search, and human-in-the-loop escalation",
      codename: "ORACLE",
      status: "IN_PROGRESS",
      classification: "LLM / NLP",
      problem: "Customer support overwhelmed with repetitive queries, 45min average response time",
      solution: "Building RAG-based assistant with fine-tuned LLM, semantic search, and human-in-the-loop escalation",
      impact: "Target: 80% query resolution without human intervention",
      techStack: ["Python", "LangChain", "OpenAI API", "Pinecone", "Next.js", "WebSocket"],
      featured: false,
      metrics: [
        { label: "Auto-Resolution", value: "80%" },
        { label: "Response Time", value: "<3s" },
        { label: "Satisfaction", value: "4.8/5" }
      ]
    },
    {
      title: "Face Recognition Attendance System",
      description: "Enterprise-grade facial recognition system for automated employee time tracking with anti-spoofing",
      codename: "KRONOS",
      status: "DEPLOYED",
      classification: "COMPUTER VISION / BIOMETRICS",
      problem: "Manual clock-in/out causing 15% payroll discrepancies, buddy-punching fraud costing $200K annually, no real-time attendance visibility",
      solution: "Deployed multi-stage facial recognition pipeline with liveness detection, 3D depth mapping anti-spoofing, edge computing for sub-200ms response, real-time dashboard with anomaly alerts, and automatic payroll integration",
      impact: "Eliminated buddy-punching fraud saving $200K/year. 99.7% recognition accuracy. Reduced HR payroll processing time by 85%. Real-time attendance visibility across 12 locations",
      techStack: ["Python", "OpenCV", "dlib", "TensorFlow", "FastAPI", "Redis", "PostgreSQL", "React", "WebSocket", "Docker"],
      featured: true,
      demoUrl: "https://demo-attendance.example.com",
      repoUrl: "https://github.com/kevinnarvaez/face-attendance-system",
      metrics: [
        { label: "Recognition Accuracy", value: "99.7%" },
        { label: "Response Time", value: "180ms" },
        { label: "Fraud Reduction", value: "100%" },
        { label: "Daily Check-ins", value: "5K+" },
        { label: "Cost Savings", value: "$200K/yr" },
        { label: "Locations", value: "12" }
      ]
    }
  ];

  // Clear existing projects first
  await prisma.project.deleteMany();

  for (const project of projectsData) {
    await prisma.project.create({ data: project });
  }

  // 4. Experience
  const expData = [
    {
      role: 'Senior System Architect',
      company: 'Future AI Labs',
      startDate: new Date('2024-01-01'),
      description: 'Leading the infrastructure team for large-scale model deployment.',
      current: true,
    },
    {
      role: 'Full Stack Engineer',
      company: 'TechCorp Global',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2023-12-31'),
      description: 'Built distributed microservices for high-volume data processing.',
      current: false,
    },
  ];

  for (const exp of expData) {
    await prisma.experience.create({ data: exp });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
