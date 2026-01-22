import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Generating slugs for existing projects...');

  // Find all projects without slugs
  const projects = await prisma.project.findMany({
    where: {
      slug: null,
    },
  });

  console.log(`Found ${projects.length} projects without slugs`);

  for (const project of projects) {
    const slug = nanoid(10);
    await prisma.project.update({
      where: { id: project.id },
      data: { slug },
    });
    console.log(`Generated slug "${slug}" for project #${project.id}: ${project.title}`);
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
