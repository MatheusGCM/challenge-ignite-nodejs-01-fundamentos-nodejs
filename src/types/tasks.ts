import { IncomingMessage as NodeIncomingMessage } from 'node:http'

export interface Task {
  id: string
  title: string
  description: string
  completed_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface Body {
  title: string
  description: string
}

export interface IncomingMessage extends NodeIncomingMessage {
  body?: Body
}
