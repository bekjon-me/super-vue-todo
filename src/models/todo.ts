export enum Importance {
  notImportant = 'not_important',
  moderately = 'moderately_important',
  important = 'important'
}

export enum Status {
  queue = 'queue',
  development = 'development',
  done = 'done'
}

export interface Todo {
  attached_files?: any[]
  beginning: Date
  completion: Date
  created?: string
  current_status: Status.queue | Status.development | Status.done | string
  description: string
  importance: Importance.important | Importance.moderately | Importance.notImportant | string
  project?: number
  ptid?: number
  subtasks?: any[]
  title: string
  updated?: string
}
