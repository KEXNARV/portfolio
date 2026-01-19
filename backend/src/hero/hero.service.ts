import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HeroDto } from './hero.dto';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async getHero(): Promise<HeroDto | null> {
    const hero = await this.prisma.hero.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!hero) return null;

    // Transform database format to frontend format
    return {
      title: hero.title,
      subtitle: hero.subtitle,
      description: hero.description,
      ctaPrimary: {
        text: hero.ctaPrimaryText,
        link: hero.ctaPrimaryLink,
      },
      ctaSecondary: {
        text: hero.ctaSecondaryText,
        link: hero.ctaSecondaryLink,
      },
      backgroundType: hero.backgroundType,
      backgroundColor: hero.backgroundColor,
      gradientFrom: hero.gradientFrom,
      gradientTo: hero.gradientTo,
      backgroundImage: hero.backgroundImage || '',
    };
  }

  async upsertHero(data: HeroDto): Promise<HeroDto> {
    const existingHero = await this.prisma.hero.findFirst({
      orderBy: { id: 'desc' },
    });

    const heroData = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      ctaPrimaryText: data.ctaPrimary.text,
      ctaPrimaryLink: data.ctaPrimary.link,
      ctaSecondaryText: data.ctaSecondary.text,
      ctaSecondaryLink: data.ctaSecondary.link,
      backgroundType: data.backgroundType,
      backgroundColor: data.backgroundColor,
      gradientFrom: data.gradientFrom,
      gradientTo: data.gradientTo,
      backgroundImage: data.backgroundImage || null,
    };

    const result = existingHero
      ? await this.prisma.hero.update({
          where: { id: existingHero.id },
          data: heroData,
        })
      : await this.prisma.hero.create({
          data: heroData,
        });

    return {
      title: result.title,
      subtitle: result.subtitle,
      description: result.description,
      ctaPrimary: {
        text: result.ctaPrimaryText,
        link: result.ctaPrimaryLink,
      },
      ctaSecondary: {
        text: result.ctaSecondaryText,
        link: result.ctaSecondaryLink,
      },
      backgroundType: result.backgroundType,
      backgroundColor: result.backgroundColor,
      gradientFrom: result.gradientFrom,
      gradientTo: result.gradientTo,
      backgroundImage: result.backgroundImage || '',
    };
  }
}
