import { SafeHtml } from "@angular/platform-browser";
import { FieldSet, Selectable } from "@shared/models/fieldSet.model";

export interface AbstractItem extends FieldSet {
  type: Selectable<string>;
  order: number;
  id?: string;
}

export class AbstractItem {
  safeHtml?: SafeHtml;
  constructor(type: Selectable<string>, order: number) {
    this.type = type;
    this.order = order;
  }
}

export class AbstractSeparator extends AbstractItem {
  constructor(list: AbstractItem[]) {
    const order = list.length > 0 ? ++list[list.length - 1].order : 0;
    super({ name: 'Séparation', value: 'separator' }, order)
  }
}

export class AbstractTitle extends AbstractItem {
  constructor(list: AbstractItem[]) {
    const order = list.length > 0 ? ++list[list.length - 1].order : 0;
    super({ name: 'Titre de section', value: 'title' }, order)
  }
}

export class AbstractField extends AbstractItem {
  public static readonly TEXT = { name: 'Texte', value: 'text' };
  public static readonly DATE = { name: 'Date', value: 'date' };
  public static readonly FILE = { name: 'Fichier', value: 'file' };
  public static readonly LINK = { name: 'Lien', value: 'link' };
  public static readonly HTML = { name: 'Html', value: 'html' };
  public static readonly IMG = { name: 'Image', value: 'image' };
  constructor(list: AbstractItem[]) {
    const order = list.length > 0 ? ++list[list.length - 1].order : 0;
    super(AbstractField.TEXT, order);
  }
}