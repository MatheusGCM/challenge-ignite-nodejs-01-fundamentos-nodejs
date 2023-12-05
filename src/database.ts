import fs from 'fs/promises'
import { Task } from './types/tasks'

const databasePath = './src/db.json'

export class Database {
  #tasks: Task[] = []

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#tasks = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#tasks))
  }

  #performActionOnTask(taskId: string, action: (index: number) => void) {
    const index = this.#tasks.findIndex((t) => t.id === taskId)
    if (index !== -1) {
      action(index)
      this.#persist()
      return true
    }
    return false
  }

  select() {
    return this.#tasks
  }

  insert(task: Task) {
    this.#tasks.push(task)
    this.#persist()
  }

  update(updateTask: Partial<Task>) {
    const { id } = updateTask
    if (id) {
      return this.#performActionOnTask(
        id,
        (index) =>
          (this.#tasks[index] = { ...this.#tasks[index], ...updateTask }),
      )
    }
  }

  delete(taskId: string) {
    return this.#performActionOnTask(taskId, (index) =>
      this.#tasks.splice(index, 1),
    )
  }

  completeTask(taskId: string) {
    return this.#performActionOnTask(
      taskId,
      (index) =>
        (this.#tasks[index] = {
          ...this.#tasks[index],
          completed_at: new Date(),
        }),
    )
  }
}
