import { Injectable } from '@angular/core';
import { SubjectService } from '@shared/abstracts/observable.abstract';
import { SearchParam } from '../components/search-result/search-result.component';

@Injectable({
  providedIn: 'root'
})
export class TabResultService extends SubjectService<SearchParam> {}
