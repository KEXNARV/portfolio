import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectDto } from './projects.dto';

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

  async create(data: CreateProjectDto): Promise<ProjectDto> {
    return this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        techStack: data.techStack || [],
        demoUrl: data.demoUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured || false,
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
}
