// lib/validation.ts

import { z } from 'zod'

// ============================================
// RESUME VALIDATION SCHEMAS
// ============================================

export const ResumeBasicSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  title: z.string().min(1, 'Title is required').max(200),
  bio: z.string().max(1000).optional(),
  email: z.string().email('Invalid email address'),
  signalUrl: z.string().url().optional().or(z.literal('')),
  linkedinPersonal: z.string().url().optional().or(z.literal('')),
  linkedinBusiness: z.string().url().optional().or(z.literal('')),
  photoUrl: z.string().optional().nullable(),
  showMission: z.boolean().default(false),
  missionTitle: z.string().max(100).optional(),
  missionText: z.string().max(1000).optional(),
})

export const ExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Job title is required').max(200),
  company: z.string().min(1, 'Company is required').max(200),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  workLocation: z.enum(['remote', 'hybrid', 'in-person']).nullable().optional(),
  duties: z.array(z.string().max(500)).min(1).max(3),
  fullBullets: z.array(z.string().max(500)).default([]),
  street: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
})

export const EducationSchema = z.object({
  id: z.string(),
  schoolName: z.string().min(1, 'School name is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(200),
  major: z.string().min(1, 'Major is required').max(200),
  location: z.string().max(200),
  yearsAttended: z.string().max(50),
})

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required').max(100),
  level: z.number().min(1).max(10),
  hoverText: z.string().max(100).optional(),
})

export const PublicationSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(300),
  year: z.string().min(4).max(4),
})

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Language is required').max(100),
  proficiency: z.enum(['Native', 'Fluent', 'Professional', 'Conversational', 'Basic']),
})

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required').max(200),
  agency: z.string().min(1, 'Agency is required').max(200),
  certNumber: z.string().max(100).optional().nullable(),
  certDate: z.string().min(1, 'Date is required'),
  agencyUrl: z.string().url().optional().nullable().or(z.literal('')),
  iconUrl: z.string().optional().nullable(),
})

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(300),
  subtitle: z.string().max(200).optional().nullable(),
  excerpt: z.string().min(1, 'Excerpt is required').max(1000),
  url: z.string().url('Invalid URL'),
  ogImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  publishedDate: z.string().min(1, 'Published date is required'),
  readTime: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().max(50)).default([]),
  order: z.number().min(0).default(0),
})

// Full Resume Schema
export const FullResumeSchema = z.object({
  ...ResumeBasicSchema.shape,
  experiences: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  publications: z.array(PublicationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  articles: z.array(ArticleSchema).default([]),
})

// ============================================
// SHOWCASE VALIDATION SCHEMA
// ============================================

export const ShowcaseItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(500),
  imageUrl: z.string().optional().nullable(),
  linkUrl: z.string().min(1, 'Link is required'),
  linkType: z.enum(['internal', 'external', 'mailto']),
  order: z.number().min(0),
  isActive: z.boolean().default(true),
})

export const ShowcaseItemsSchema = z.array(ShowcaseItemSchema).max(6, 'Maximum 6 showcase items allowed')

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate data and return formatted errors
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const key = issue.path.join('.')
          errors[key] = issue.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

/**
 * Safe parse with default values
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data)
  } catch {
    return null
  }
}