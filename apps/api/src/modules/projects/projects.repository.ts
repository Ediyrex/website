import { ProjectDTO } from '@ediyrex/contracts'

export interface CreateProjectPayload {
  title: string
  client: string
  division: 'media' | 'digital' | 'ai' | 'hybrid'
  year: string
  status?: 'Published' | 'Draft'
  featured?: boolean
  heroTagline: string
  overview: string
  technologies?: string[]
  results?: { metric: string; label: string }[]
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

// In-memory persistent project store (seeded with high-fidelity studio projects)
let projectsStore: ProjectDTO[] = [
  {
    id: 'PRJ-01',
    slug: 'aegis-platform',
    title: 'Aegis Platform',
    client: 'Aegis Security Labs',
    division: 'digital',
    year: '2026',
    status: 'Published',
    featured: true,
    heroTagline: 'Institutional security observability platform engineered for sub-second telemetry.',
    overview: 'Complete redesign and frontend architecture overhaul for a next-generation security command center.',
    technologies: ['Next.js 15', 'React Server Components', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'PRJ-02',
    slug: 'lumina-origin',
    title: 'Lumina Origin',
    client: 'Lumina Optics',
    division: 'media',
    year: '2025',
    status: 'Published',
    featured: true,
    heroTagline: 'Anamorphic 4K commercial cinematography celebrating precision optical engineering.',
    overview: 'Full commercial film production including scripting, cinema rig shoot, and DaVinci Resolve color finishing.',
    technologies: ['RED V-Raptor 8K', 'Anamorphic Glass', 'DaVinci Resolve Studio'],
  },
  {
    id: 'PRJ-03',
    slug: 'synthesis-concierge',
    title: 'Synthesis Concierge',
    client: 'Synthesis AI',
    division: 'ai',
    year: '2026',
    status: 'Published',
    featured: true,
    heroTagline: 'Autonomous multi-agent enterprise concierge with sub-second retrieval latency.',
    overview: 'Custom agentic RAG system that automates client onboarding and synthesizes research dossiers.',
    technologies: ['n8n Pipelines', 'Hybrid Vector Search', 'Structured LLM Outputs'],
  },
  {
    id: 'PRJ-04',
    slug: 'vortex-identity',
    title: 'Vortex Identity',
    client: 'Vortex Capital',
    division: 'hybrid',
    year: '2025',
    status: 'Published',
    featured: false,
    heroTagline: 'Integrated brand identity, launch commercial, and interactive portfolio portal.',
    overview: 'Cross-disciplinary studio engagement delivering both visual identity assets and full digital presence.',
    technologies: ['Full Studio Package', 'Next.js App', 'Commercial Shoot'],
  },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const ProjectsRepository = {
  getAll(status?: 'Published' | 'Draft' | 'all', division?: string): ProjectDTO[] {
    let list = [...projectsStore]
    if (status && status !== 'all') {
      list = list.filter((p) => p.status === status)
    }
    if (division && division !== 'all') {
      list = list.filter((p) => p.division === division || (p.division === 'hybrid' && division === 'digital'))
    }
    return list
  },

  getBySlug(slug: string): ProjectDTO | null {
    return projectsStore.find((p) => p.slug === slug) || null
  },

  getById(id: string): ProjectDTO | null {
    return projectsStore.find((p) => p.id === id) || null
  },

  create(payload: CreateProjectPayload): ProjectDTO {
    const nextNum = projectsStore.length + 1
    const id = `PRJ-${String(nextNum).padStart(2, '0')}`
    const slug = generateSlug(payload.title)

    const newProject: ProjectDTO = {
      id,
      slug,
      title: payload.title,
      client: payload.client,
      division: payload.division,
      year: payload.year || String(new Date().getFullYear()),
      status: payload.status || 'Published',
      featured: payload.featured ?? false,
      heroTagline: payload.heroTagline || '',
      overview: payload.overview || '',
      technologies: payload.technologies || [],
    }

    // Insert at front
    projectsStore.unshift(newProject)
    return newProject
  },

  update(id: string, payload: UpdateProjectPayload): ProjectDTO | null {
    const index = projectsStore.findIndex((p) => p.id === id)
    if (index === -1) return null

    const existing = projectsStore[index]
    const updated: ProjectDTO = {
      ...existing,
      ...payload,
      slug: payload.title ? generateSlug(payload.title) : existing.slug,
    }

    projectsStore[index] = updated
    return updated
  },

  toggleStatus(id: string): ProjectDTO | null {
    const index = projectsStore.findIndex((p) => p.id === id)
    if (index === -1) return null

    const existing = projectsStore[index]
    const newStatus = existing.status === 'Published' ? 'Draft' : 'Published'
    projectsStore[index] = { ...existing, status: newStatus }
    return projectsStore[index]
  },

  delete(id: string): boolean {
    const initialLen = projectsStore.length
    projectsStore = projectsStore.filter((p) => p.id !== id)
    return projectsStore.length < initialLen
  },
}

