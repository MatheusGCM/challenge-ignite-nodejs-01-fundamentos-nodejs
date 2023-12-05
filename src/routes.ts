import { ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'
import { Database } from './database.ts'
import { IncomingMessage } from './types/tasks.ts'
import { z } from 'zod'
import { message } from './utils/messages.ts'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: '/tasks',
    handle: (req: IncomingMessage, res: ServerResponse) => {
      const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
      })
      try {
        const { title, description } = bodySchema.parse(req.body)

        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        }

        database.insert(task)

        return res.writeHead(201).end(JSON.stringify(task))
      } catch {
        return res.writeHead(400).end(
          JSON.stringify({
            error: message.error.invalidBody,
          }),
        )
      }
    },
  },
  {
    method: 'GET',
    path: '/tasks',
    handle: (req: IncomingMessage, res: ServerResponse) => {
      const tasks = database.select()
      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'PUT',
    path: /^\/tasks\/([^/]+)$/,
    handle: (req: IncomingMessage, res: ServerResponse) => {
      const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
      })

      try {
        const { body, url } = req
        const { title, description } = bodySchema.parse(body)
        const id = url?.split('/')[2]

        const updateTask = {
          id,
          title,
          description,
          updated_at: new Date(),
        }

        const hasUpdated = database.update(updateTask)

        if (hasUpdated) return res.writeHead(204).end()
        throw new Error()
      } catch {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: message.error.invalidId }))
      }
    },
  },
  {
    method: 'DELETE',
    path: /^\/tasks\/([^/]+)$/,
    handle: (req: IncomingMessage, res: ServerResponse) => {
      const id = req.url?.split('/')[2]
      if (id) {
        const hasDeleted = database.delete(id)
        if (hasDeleted) return res.writeHead(204).end()
      }

      return res
        .writeHead(404)
        .end(JSON.stringify({ error: message.error.invalidId }))
    },
  },
  {
    method: 'PATCH',
    path: /^\/tasks\/([^/]+)\/complete$/,
    handle: (req: IncomingMessage, res: ServerResponse) => {
      const id = req.url?.split('/')[2]
      if (id) {
        const hasComplete = database.completeTask(id)
        if (hasComplete)
          return res.end(JSON.stringify({ complete_at: new Date() }))
      }
      return res
        .writeHead(404)
        .end(JSON.stringify({ error: message.error.invalidId }))
    },
  },
]
