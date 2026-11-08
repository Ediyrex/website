import { Router } from 'express'
import { sendSuccess, sendError } from '../../shared/http/response.js'
import { ProjectsRepository } from './projects.repository.js'

export const projectsRouter = Router()

// Public: Get all published projects
projectsRouter.get('/projects', (req, res) => {
  const division = typeof req.query.division === 'string' ? req.query.division : undefined
  const projects = ProjectsRepository.getAll('Published', division)
  sendSuccess(res, projects)
})

// Public: Get featured projects
projectsRouter.get('/projects/featured', (_req, res) => {
  const all = ProjectsRepository.getAll('Published')
  const featured = all.filter((p) => p.featured)
  sendSuccess(res, featured.length > 0 ? featured : all.slice(0, 3))
})

// Public: Get single project by slug
projectsRouter.get('/projects/:slug', (req, res) => {
  const project = ProjectsRepository.getBySlug(req.params.slug)
  if (!project || project.status !== 'Published') {
    return sendError(res, `Project '${req.params.slug}' not found`, 404, 'NOT_FOUND')
  }
  sendSuccess(res, project)
})

// Admin: Get all projects including drafts
projectsRouter.get('/admin/projects', (req, res) => {
  const division = typeof req.query.division === 'string' ? req.query.division : undefined
  const status = typeof req.query.status === 'string' ? (req.query.status as any) : 'all'
  const projects = ProjectsRepository.getAll(status, division)
  sendSuccess(res, projects)
})

// Admin: Create new project
projectsRouter.post('/admin/projects', (req, res) => {
  const { title, client, division } = req.body
  if (!title || !client || !division) {
    return sendError(res, 'Title, client, and division are required', 400, 'VALIDATION_ERROR')
  }

  const created = ProjectsRepository.create(req.body)
  sendSuccess(res, created, 201)
})

// Admin: Update existing project
projectsRouter.put('/admin/projects/:id', (req, res) => {
  const updated = ProjectsRepository.update(req.params.id, req.body)
  if (!updated) {
    return sendError(res, `Project '${req.params.id}' not found`, 404, 'NOT_FOUND')
  }
  sendSuccess(res, updated)
})

// Admin: Toggle project status (Published <-> Draft)
projectsRouter.patch('/admin/projects/:id/status', (req, res) => {
  const updated = ProjectsRepository.toggleStatus(req.params.id)
  if (!updated) {
    return sendError(res, `Project '${req.params.id}' not found`, 404, 'NOT_FOUND')
  }
  sendSuccess(res, updated)
})

// Admin: Delete project
projectsRouter.delete('/admin/projects/:id', (req, res) => {
  const success = ProjectsRepository.delete(req.params.id)
  if (!success) {
    return sendError(res, `Project '${req.params.id}' not found`, 404, 'NOT_FOUND')
  }
  sendSuccess(res, { deleted: true, id: req.params.id })
})
