import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { Nameable } from '@shared/models/fieldSet.model';

export interface RssFeed extends Identifiable, Nameable {
  url: string;
  slug: string;
  order: number;
}

export class RssFeed {
  public static readonly NAME_KEY = { key: 'name', name: 'Nom' } as const;
  public static readonly URL_KEY = { key: 'url', name: 'Url' } as const;;
  public static readonly SLUG_KEY = { key: 'slug', name: 'Slug' } as const;;
  public static readonly ORDER_KEY = { key: 'order', name: 'Ordre' } as const;

  constructor(public order: number) {
    this.name = '';
    this.url = '';
    this.slug = '';
  }
}
