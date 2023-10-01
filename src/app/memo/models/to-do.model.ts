export interface toDoEntity {
  id?: string,
  isResolved: boolean,
  description: string,
  priority: number,
  creatingDate: Date,
  updatingDate?: Date,
  category: string
}