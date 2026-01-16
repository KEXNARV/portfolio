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
      title: 'Neural Bridge API',
      description: 'High-throughput inference API connecting LLMs with legacy enterprise systems. Handles 50k+ req/s with <50ms latency.',
      techStack: ['Python', 'FastAPI', 'Redis', 'Docker'],
      featured: true,
    },
    {
      title: 'Sentient Dashboard',
      description: 'Real-time visualization of neural network states using WebGL and WebSockets. A window into the black box.',
      techStack: ['Next.js', 'Three.js', 'Socket.io', 'NestJS'],
      featured: true,
    },
    {
      title: 'Auto-Scaler V2',
      description: 'Predictive scaling engine for Kubernetes clusters based on incoming traffic patterns and model load.',
      techStack: ['Go', 'Kubernetes', 'Prometheus', 'Terraform'],
      featured: false,
    },
  ];

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
