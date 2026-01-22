-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "classification" TEXT,
ADD COLUMN     "codename" TEXT,
ADD COLUMN     "impact" TEXT,
ADD COLUMN     "metrics" JSONB,
ADD COLUMN     "problem" TEXT,
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "status" TEXT;
