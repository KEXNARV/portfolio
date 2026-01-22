export class CreateProjectDto {
  title: string;
  description: string;
  imageUrl?: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  // Industrial theme fields
  codename?: string;
  status?: string;
  classification?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  metrics?: any; // JSON array of {label, value}
}

export class UpdateProjectDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  techStack?: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  // Industrial theme fields
  codename?: string;
  status?: string;
  classification?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  metrics?: any; // JSON array of {label, value}
}

export class ProjectDto {
  id: number;
  slug: string | null;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  // Industrial theme fields
  codename: string | null;
  status: string | null;
  classification: string | null;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  metrics: any | null;
  createdAt: Date;
  updatedAt: Date;
}
