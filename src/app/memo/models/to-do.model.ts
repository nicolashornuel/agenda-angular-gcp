import { Timestamp } from "firebase/firestore"

export interface toDoDTO {
  id?: string,
  isResolved: boolean,
  description: string,
  priority: number,
  creatingDate: Date,
  updatingDate?: Date,
  category: string
}

export interface toDoEntity {
  id?: string,
  isResolved: boolean,
  description: string,
  priority: number,
  creatingDate: Timestamp,
  updatingDate?: Timestamp,
  category: string
}