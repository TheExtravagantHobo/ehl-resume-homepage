// types/index.ts

/**
 * Complete type definitions for the application
 * No 'any' types allowed!
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
    id: string
    email: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Session {
    user: {
      id: string
      email: string
    }
    expires: string
  }
  
  // ============================================
  // RESUME TYPES
  // ============================================
  
  export interface Resume {
    id: string
    name: string
    title: string
    bio?: string | null
    photoUrl?: string | null
    email: string
    signalUrl?: string | null
    linkedinPersonal?: string | null
    linkedinBusiness?: string | null
    showMission: boolean
    missionTitle?: string | null
    missionText?: string | null
    updatedAt: Date
  }
  
  export interface Experience {
    id: string
    jobTitle: string
    company: string
    duties: string[]
    fullBullets: string[]
    workLocation?: 'remote' | 'hybrid' | 'in-person' | null
    startDate: Date | string
    endDate?: Date | string | null
    isCurrent: boolean
    dateRange?: string // Computed field for display
    street?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    order: number
  }
  
  export interface Education {
    id: string
    schoolName: string
    degree: string
    major: string
    location: string
    yearsAttended: string
    order: number
  }
  
  export interface Skill {
    id: string
    name: string
    level: number // 1-10
    hoverText?: string | null
    order: number
  }
  
  export interface Publication {
    id: string
    title: string
    year: string
    order: number
  }
  
  export interface Language {
    id: string
    name: string
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic'
    order: number
  }
  
  export interface Certification {
    id: string
    name: string
    agency: string
    certNumber?: string | null
    certDate: Date | string
    agencyUrl?: string | null
    iconUrl?: string | null
    order: number
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Article {
    id: string
    title: string
    subtitle?: string | null
    excerpt: string
    url: string
    ogImageUrl?: string | null
    publishedDate: Date | string
    readTime?: string | null
    tags: string[]
    order: number
    createdAt: Date
    updatedAt: Date
  }
  
  // Complete Resume Type
  export interface CompleteResume extends Resume {
    experiences: Experience[]
    education: Education[]
    skills: Skill[]
    publications: Publication[]
    languages: Language[]
    certifications: Certification[]
    articles: Article[]
  }
  
  // ============================================
  // SHOWCASE TYPES
  // ============================================
  
  export interface ShowcaseItem {
    id: string
    title: string
    description: string
    imageUrl?: string | null
    linkUrl: string
    linkType: 'internal' | 'external' | 'mailto'
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }
  
  // ============================================
  // API RESPONSE TYPES
  // ============================================
  
  export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
  }
  
  export interface ApiError {
    error: string
    message?: string
    details?: unknown
    statusCode: number
  }
  
  export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
  }
  
  // ============================================
  // FORM TYPES
  // ============================================
  
  export interface FormState<T = unknown> {
    data: T
    errors: Record<string, string>
    isSubmitting: boolean
    isValid: boolean
  }
  
  export interface ValidationResult {
    success: boolean
    errors?: Record<string, string>
  }
  
  // ============================================
  // UI COMPONENT PROPS
  // ============================================
  
  export interface BaseComponentProps {
    className?: string
    children?: React.ReactNode
  }
  
  export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
  }
  
  export interface InputProps extends BaseComponentProps {
    label?: string
    error?: string
    helper?: string
    type?: string
    placeholder?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    required?: boolean
  }
  
  export interface CardProps extends BaseComponentProps {
    hover?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
    onClick?: () => void
  }
  
  // ============================================
  // UTILITY TYPES
  // ============================================
  
  // Make all properties optional except the ones specified
  export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>
  
  // Make specific properties required
  export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
  
  // Omit multiple properties
  export type OmitMultiple<T, K extends keyof T> = Omit<T, K>
  
  // Deep partial type
  export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
  }
  
  // Nullable type
  export type Nullable<T> = T | null
  
  // Maybe type
  export type Maybe<T> = T | null | undefined
  
  // Async function type
  export type AsyncFunction<T = void> = () => Promise<T>
  
  // React event handlers
  export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void
  export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void
  export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void
  
  // ============================================
  // DATABASE TYPES (Prisma Extensions)
  // ============================================
  
  export type DatabaseOperation = 'create' | 'read' | 'update' | 'delete'
  
  export interface DatabaseResult<T> {
    success: boolean
    data?: T
    error?: string
    affectedRows?: number
  }
  
  // ============================================
  // CACHE TYPES
  // ============================================
  
  export interface CacheOptions {
    ttl?: number // Time to live in seconds
    tags?: string[] // Cache tags for invalidation
  }
  
  export interface CacheEntry<T = unknown> {
    key: string
    value: T
    expiry: number
    tags?: string[]
  }
  
  // ============================================
  // RATE LIMITING TYPES
  // ============================================
  
  export interface RateLimitInfo {
    limit: number
    remaining: number
    reset: Date
    retryAfter?: number
  }
  
  // ============================================
  // LOGGING TYPES
  // ============================================
  
  export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
  
  export interface LogContext {
    userId?: string
    ip?: string
    userAgent?: string
    method?: string
    path?: string
    duration?: number
    [key: string]: unknown
  }
  
  // ============================================
  // THEME TYPES
  // ============================================
  
  export interface Theme {
    name: string
    colors: {
      background: {
        primary: string
        secondary: string
        tertiary: string
        overlay: string
      }
      text: {
        primary: string
        secondary: string
        muted: string
        disabled: string
      }
      accent: {
        primary: string
        secondary: string
        hover: string
      }
      interactive: {
        hover: string
        active: string
        disabled: string
      }
      border: {
        primary: string
        secondary: string
        focus: string
      }
      status: {
        success: string
        warning: string
        error: string
        info: string
      }
    }
  }
  
  // ============================================
  // CONSTANTS
  // ============================================
  
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  } as const
  
  export const CACHE_TAGS = {
    RESUME: 'resume',
    SHOWCASE: 'showcase',
    ARTICLES: 'articles',
    USER: 'user',
  } as const
  
  export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    RATE_LIMIT: 'RATE_LIMIT',
    DATABASE_ERROR: 'DATABASE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
  } as const
  
  // ============================================
  // TYPE GUARDS
  // ============================================
  
  export function isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      'statusCode' in error
    )
  }
  
  export function isCompleteResume(data: unknown): data is CompleteResume {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'name' in data &&
      'experiences' in data &&
      Array.isArray((data as any).experiences)
    )
  }
  
  export function isShowcaseItem(item: unknown): item is ShowcaseItem {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'title' in item &&
      'linkUrl' in item
    )
  }
  
  // ============================================
  // EXPORT ALL TYPES
  // ============================================
  
  export type {
    DatabaseOperation as DBOp,
    AsyncFunction as AsyncFn,
    ClickHandler as OnClick,
    ChangeHandler as OnChange,
    SubmitHandler as OnSubmit,
  }