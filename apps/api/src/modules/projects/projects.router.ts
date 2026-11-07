import { Router } from 'express'
import { ProjectDTO } from '@ediyrex/contracts'
import { sendSuccess, sendError } from '../../shared/http/response.js'

const PROJECTS_SEED: ProjectDTO[] = [
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

export const projectsRouter = Router()

// Public: Get all published projects
projectsRouter.get('/projects', (_req, res) => {
  const published = PROJECTS_SEED.filter((p) => p.status === 'Published')
  sendSuccess(res, published)
})

// Public: Get featured projects
projectsRouter.get('/projects/featured', (_req, res) => {
  const featured = PROJECTS_SEED.filter((p) => p.status === 'Published' && p.featured)
  sendSuccess(res, featured)
})

// Public: Get single project by slug
projectsRouter.get('/projects/:slug', (req, res) => {
  const project = PROJECTS_SEED.find((p) => p.slug === req.params.slug && p.status === 'Published')
  if (!project) {
    return sendError(res, `Project with slug '${req.params.slug}' not found`, 404, 'NOT_FOUND')
  }
  sendSuccess(res, project)
})

// Admin: Get all projects including drafts
projectsRouter.get('/admin/projects', (_req, res) => {
  sendSuccess(res, PROJECTS_SEED)
})

