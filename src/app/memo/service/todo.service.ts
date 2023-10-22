import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { AbstractCrudService } from 'app/core/services/abstractCrud.service';
import { toDoDTO, toDoEntity } from '../models/to-do.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends AbstractCrudService {

  constructor() {
    super('todoList');
  }

  public async getAllwithMapping(): Promise<toDoDTO[]> {
    const { data } = await this.getAll();
    return this.entitiesToDTOs(data as toDoEntity[]);
  }

  public async saveWithMapping(toDoDTO: toDoDTO): Promise<string> {
    const toDoEntity: toDoEntity = this.dtoToEntity(toDoDTO);
    return this.save(toDoEntity);
  }

  public async updateWithMapping(toDoDTO: toDoDTO): Promise<void> {
    const toDoEntity: toDoEntity = this.dtoToEntity(toDoDTO);
    return this.update(toDoEntity, toDoEntity.id!);
  }


  private entitiesToDTOs(toDoEntities: toDoEntity[]): toDoDTO[] {
    return toDoEntities.map((toDoEntity: toDoEntity) => ({
      ...toDoEntity,
      creatingDate: this.toDate(toDoEntity.creatingDate),
      updatingDate: toDoEntity.updatingDate ? this.toDate(toDoEntity.updatingDate) : undefined
    }));
  }

  private dtoToEntity(toDoDTO: toDoDTO): toDoEntity {
    const toDoEntity: toDoEntity = {
      isResolved: toDoDTO.isResolved,
      description: toDoDTO.description,
      priority: toDoDTO.priority,
      category: toDoDTO.category,
      creatingDate: toDoDTO.id ? Timestamp.fromDate(new Date(toDoDTO.creatingDate)) : Timestamp.fromDate(new Date())
    };
    if (toDoDTO.id) {
      toDoEntity.id = toDoDTO.id;
      toDoEntity.updatingDate = Timestamp.fromDate(new Date());
    }
    return toDoEntity;
  }

}
