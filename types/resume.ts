export interface Experience {
    id: string
    jobTitle: string
    company: string
    duties: string[]
    fullBullets: string[]
    workLocation?: string | null
    startDate?: string
    endDate?: string | null
    isCurrent?: boolean
    dateRange?: string
    street?: string
    city?: string
    state?: string
    zipCode?: string
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
    level: number
    hoverText: string
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
    proficiency: string
    order: number
  }
  
  export interface Certification {
    id: string
    name: string
    agency: string
    certNumber?: string
    certDate: string
    agencyUrl?: string
    iconUrl?: string | null
    order: number
  }
  
  export interface Article {
    id: string
    title: string
    subtitle?: string
    excerpt?: string
    url: string
    ogImageUrl?: string
    publishedDate: string
    readTime?: string | null
    tags?: string[]
    order: number
  }
  
  export interface ShowcaseItem {
    id: string
    title: string
    description: string
    imageUrl?: string | null
    linkUrl: string
    linkType: 'internal' | 'external' | 'mailto'
    order: number
    isActive: boolean
  }
  
  export interface ResumeData {
    id: string
    name: string
    title: string
    bio: string
    email: string
    signalUrl: string
    linkedinPersonal: string
    linkedinBusiness: string
    photoUrl: string | null
    showMission: boolean
    missionTitle: string
    missionText: string
    experiences: Experience[]
    education: Education[]
    skills: Skill[]
    publications: Publication[]
    languages: Language[]
    certifications: Certification[]
    articles: Article[]
  }