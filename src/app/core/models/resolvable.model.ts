import { ActivatedRoute } from "@angular/router";

export interface Resolvable<T = any> {
  route: ActivatedRoute;
  isLoading: boolean;
  data: T;
}

export class Resolvable<T = any> {
  constructor(route: ActivatedRoute, data: T) {
    this.route = route;
    this.isLoading = false;
    this.data = data;
  }
}