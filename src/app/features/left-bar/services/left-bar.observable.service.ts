import { inject, Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { BehaviorSubjectService, ObservableService } from '@shared/abstracts/observable.abstract';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import {
  Playlist,
  PlaylistSummary,
  PlaylistVideo,
  RepeatMode,
  VISITOR_PLAYLIST_ID,
  VISITOR_PLAYLIST_SUMMARY
} from '../models/left-bar.model';
import { FirestorePlaylistService, FirestorePlaylistSummaryService } from './left-bar.firestore.service';

@Injectable()
export class PlaylistSummaryService extends ObservableService<PlaylistSummary[]> {
  private firestore = inject(FirestorePlaylistSummaryService);
  private auth = inject(Auth);

  constructor() {
    super();
    authState(this.auth)
      .pipe(switchMap(user => this.load(user)))
      .subscribe(playlists => this.set$(playlists));
  }

  private load(user: User | null): Observable<PlaylistSummary[]> {
    return user ? this.firestore.getAllByOwnerId(user.uid) : of([VISITOR_PLAYLIST_SUMMARY]);
  }
}

@Injectable()
export class PlaylistService extends BehaviorSubjectService<Playlist> {
  protected firestore = inject(FirestorePlaylistService);
  private loaded = false;

  constructor() {
    super({ videos: [] });
  }

  public load(playlistId: string): Observable<Playlist> {
    return this.firestore.getById(playlistId).pipe(
      filter(Boolean),
      tap(playlist => {
        this.set$(playlist ?? { id: playlistId, videos: [] });
        this.loaded = true;
      })
    );
  }

  public loadInMemory(playlist: Playlist): void {
    this.set$(playlist);
    this.loaded = true;
  }

  public clear(): void {
    this.loaded = false;
    this.set$({ videos: [] });
  }

  public remove(video: PlaylistVideo): void {
    this.update({
      ...this.value,
      videos: this.value.videos.filter(v => v.videoId !== video.videoId)
    });
  }

  public move(): void {
    this.update(this.value);
  }

  private async update(playlist: Playlist) {
    if (!this.loaded) return;

    if (playlist.id === VISITOR_PLAYLIST_ID) {
      this.set$(playlist);
      return;
    }

    await this.save(playlist);
  }

  @IsAdmin()
  private async save(playlist: Playlist) {
    await this.firestore.saveOrUpdate(playlist);
    this.set$(playlist);
  }
}

@Injectable()
export class CurrentVideoService extends BehaviorSubjectService<PlaylistVideo | null> {
  constructor() {
    super(null);
  }
}

@Injectable()
export class RepeatModeService extends BehaviorSubjectService<RepeatMode> {
  constructor() {
    super(RepeatMode.None);
  }
}

@Injectable()
export class SuffleService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}

@Injectable()
export class PlayingService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}

@Injectable()
export class SidebarIsOpenedService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}
