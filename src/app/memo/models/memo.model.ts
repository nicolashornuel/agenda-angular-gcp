import { FieldSet, Selectable } from "@shared/models/fieldSet.model";

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

export class AbstractSeparator extends AbstractItem {
  constructor(list: AbstractItem[]) {
    super({ name: 'Séparation', value: 'separator' }, ++list[list.length - 1].order)
  }
}

export class AbstractTitle extends AbstractItem {
  constructor(list: AbstractItem[]) {
    super({ name: 'Titre de section', value: 'title' }, ++list[list.length - 1].order)
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