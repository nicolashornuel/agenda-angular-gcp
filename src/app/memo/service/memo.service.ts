import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { FieldSet, Selectable } from '@shared/models/fieldSet.model';

@Injectable({
  providedIn: 'root'
})
export class MemoService extends FirestoreService<any> {
  constructor() {
    super();
  }
}

export interface AbstractItem extends FieldSet {
  type: Selectable<string>;
  order: number;
  id?: string;
}

export class AbstractItem {
  constructor(type: Selectable<string>, order: number) {
    this.type = type;
    this.order = order;
  }
}

export class AbstractDisplay extends AbstractItem {
  public static readonly SEPARATOR = { name: 'Séparation', value: 'separator' };
  constructor(list: AbstractItem[], type: Selectable<string>) {
    super(type, ++list[list.length - 1].order)
  }
}

export class AbstractSection extends AbstractItem {
  public static readonly TITLE = { name: 'Titre de section', value: 'title' };
  constructor(list: AbstractItem[], type: Selectable<string>) {
    super(type, ++list[list.length - 1].order)
  }
}

export class AbstractField extends AbstractItem {
  public static readonly TEXT = { name: 'Texte', value: 'text' };
  public static readonly DATE = { name: 'Date', value: 'date' };
  public static readonly FILE = { name: 'Fichier', value: 'file' };
  public static readonly LINK = { name: 'Lien', value: 'link' };
  constructor(list: AbstractItem[]) {
    super(AbstractField.TEXT, ++list[list.length - 1].order);
  }
}
