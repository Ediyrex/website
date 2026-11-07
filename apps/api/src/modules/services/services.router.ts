import { Router } from 'express'
import { sendSuccess } from '../../shared/http/response.js'

const SERVICE_DIVISIONS = [
  {
    id: 'media',
    name: 'Media Production',
    accentColor: '#E58A76',
    description: 'Cinematic visual narratives, commercial filmmaking, editorial photography, and motion graphics.',
  },
  {
    id: 'web',
    name: 'Web & Digital Products',
    accentColor: '#7BA9F5',
    description: 'Modern, scalable web applications, SaaS platforms, and high-performance digital experiences.',
  },
  {
    id: 'agents',
    name: 'Agents & Automation',
    accentColor: '#B5A0F5',
    description: 'Custom AI agents, autonomous n8n workflows, RAG systems, and business process automation.',
  },
]

export const servicesRouter = Router()

// Public: Get divisions
servicesRouter.get('/services/divisions', (_req, res) => {
  sendSuccess(res, SERVICE_DIVISIONS)
})

// Public: Get all services
servicesRouter.get('/services', (_req, res) => {
  sendSuccess(res, SERVICE_DIVISIONS)
})

