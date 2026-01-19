export class CtaDto {
  text: string;
  link: string;
}

export class HeroDto {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: CtaDto;
  ctaSecondary: CtaDto;
  backgroundType: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage?: string;
}
