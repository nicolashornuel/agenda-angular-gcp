import { Injectable } from '@angular/core';
import { AbstractCrudFunctionService } from '@core/services/abstractCrudFunction.service';
import { FirestoreService } from '@core/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends FirestoreService<any> {
  constructor() {
    super('locations');
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocationFunctionService extends AbstractCrudFunctionService {
  constructor() {
    super('locations');
  }
}
