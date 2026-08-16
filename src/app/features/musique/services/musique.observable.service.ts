import { Injectable } from '@angular/core';
import { SubjectService } from '@shared/abstracts/observable.abstract';
import { SearchParam } from '../components/search-result/search-result.component';
import { PlaylistService, PlaylistSummaryService } from '@features/left-bar/services/left-bar.observable.service';

@Injectable()
export class TabResultService extends SubjectService<SearchParam> {}

@Injectable()
export class MusiquePlaylistSummaryService extends PlaylistSummaryService {}

@Injectable()
export class MusiquePlaylistService extends PlaylistService {}

