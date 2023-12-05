import { ServerResponse } from 'node:http'
import { Body, IncomingMessage } from '../types/tasks'

export async function json(req: IncomingMessage, res: ServerResponse) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = {} as Body
  }

  res.setHeader('Content-type', 'application/json')
}
