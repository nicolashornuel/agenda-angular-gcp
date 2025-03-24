import { Nameable } from "@shared/models/fieldSet.model";
import { Identifiable } from "app/train/models/reservation.model";

export interface RssFeed extends Identifiable, Nameable {
    url: string;
    slug: string;
    order: number;
  }
  
  export class RssFeed {

    public static readonly NAME_KEY = { key: 'name', name: 'Nom' };
    public static readonly URL_KEY = { key: 'url', name: 'Url' };
    public static readonly SLUG_KEY = { key: 'slug', name: 'Slug' };
    public static readonly ORDER_KEY = { key: 'order', name: 'Ordre' };
    
    constructor(order: number) {
        this.name = '';
        this.url = '';
        this.slug = '';
        this.order = order;
    }
  }
  