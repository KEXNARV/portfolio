export class CreateProjectDto {
  title: string;
  description: string;
  imageUrl?: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export class UpdateProjectDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  techStack?: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export class ProjectDto {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
