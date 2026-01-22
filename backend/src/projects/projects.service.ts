import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectDto } from './projects.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProjectDto[]> {
    return this.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: number): Promise<ProjectDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findBySlug(slug: string): Promise<ProjectDto> {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }

    return project;
  }

  async create(data: CreateProjectDto): Promise<ProjectDto> {
    // Generate unique slug
    const slug = nanoid(10); // Generates a 10-character unique ID

    return this.prisma.project.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        techStack: data.techStack || [],
        demoUrl: data.demoUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured || false,
        codename: data.codename || null,
        status: data.status || null,
        classification: data.classification || null,
        problem: data.problem || null,
        solution: data.solution || null,
        impact: data.impact || null,
        metrics: data.metrics || null,
      },
    });
  }

  async update(id: number, data: UpdateProjectDto): Promise<ProjectDto> {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.techStack !== undefined && { techStack: data.techStack }),
        ...(data.demoUrl !== undefined && { demoUrl: data.demoUrl }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.codename !== undefined && { codename: data.codename }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.classification !== undefined && { classification: data.classification }),
        ...(data.problem !== undefined && { problem: data.problem }),
        ...(data.solution !== undefined && { solution: data.solution }),
        ...(data.impact !== undefined && { impact: data.impact }),
        ...(data.metrics !== undefined && { metrics: data.metrics }),
      },
    });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { deleted: true };
  }

  async generateSlugs(): Promise<{ message: string; updated: number }> {
    const projects = await this.prisma.project.findMany({
      where: {
        slug: null,
      },
    });

    let updated = 0;
    for (const project of projects) {
      const slug = nanoid(10);
      await this.prisma.project.update({
        where: { id: project.id },
        data: { slug },
      });
      updated++;
    }

    return {
      message: `Generated slugs for ${updated} projects`,
      updated,
    };
  }
}
