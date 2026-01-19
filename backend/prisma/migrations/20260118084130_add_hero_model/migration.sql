-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ctaPrimaryText" TEXT NOT NULL DEFAULT 'View Projects',
    "ctaPrimaryLink" TEXT NOT NULL DEFAULT '#projects',
    "ctaSecondaryText" TEXT NOT NULL DEFAULT 'Contact Me',
    "ctaSecondaryLink" TEXT NOT NULL DEFAULT '#contact',
    "backgroundType" TEXT NOT NULL DEFAULT 'solid',
    "backgroundColor" TEXT NOT NULL DEFAULT '#0a0a0a',
    "gradientFrom" TEXT NOT NULL DEFAULT '#0a0a0a',
    "gradientTo" TEXT NOT NULL DEFAULT '#1a1a2e',
    "backgroundImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);
