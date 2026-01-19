import { Controller, Get, Post, Body } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroDto } from './hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  async getHero(): Promise<HeroDto> {
    const hero = await this.heroService.getHero();
    if (!hero) {
      // Return default data if no hero exists
      return {
        title: 'Kevin Narvaez',
        subtitle: 'AI Product System Engineer',
        description: 'I architect the bridge between AI research and production systems.',
        ctaPrimary: { text: 'View Projects', link: '#projects' },
        ctaSecondary: { text: 'Contact Me', link: '#contact' },
        backgroundType: 'solid',
        backgroundColor: '#0a0a0a',
        gradientFrom: '#0a0a0a',
        gradientTo: '#1a1a2e',
        backgroundImage: '',
      };
    }
    return hero;
  }

  @Post()
  async saveHero(@Body() heroData: HeroDto): Promise<HeroDto> {
    return this.heroService.upsertHero(heroData);
  }
}
