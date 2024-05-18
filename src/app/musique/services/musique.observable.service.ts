import { Injectable } from '@angular/core';
import { SubjectService } from '@shared/abstracts/observable.abstract';

@Injectable({
  providedIn: 'root'
})
export class TabResultService extends SubjectService<any> {}
