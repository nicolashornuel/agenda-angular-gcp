import { Injectable } from '@angular/core';
import { SubjectService } from '@shared/abstracts/observable.abstract';
import { PopoverParam } from '@shared/models/popoverParam.interface';

@Injectable({
  providedIn: 'root'
})
export class PopoverService extends SubjectService<PopoverParam> {
}