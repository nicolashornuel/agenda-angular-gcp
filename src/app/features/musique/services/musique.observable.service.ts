import { Injectable } from '@angular/core';
import { SubjectService } from '@shared/abstracts/observable.abstract';
import { SearchParam } from '../components/search-result/search-result.component';
import { PlaylistService, PlaylistSummaryService } from '@features/left-bar/services/left-bar.observable.service';

@Injectable({
  providedIn: 'root'
})
export class TabResultService extends SubjectService<SearchParam> {}

@Injectable({
  providedIn: 'root'
})
export class MusiquePlaylistSummaryService extends PlaylistSummaryService {}

@Injectable({
  providedIn: 'root'
})
export class MusiquePlaylistService extends PlaylistService {}

