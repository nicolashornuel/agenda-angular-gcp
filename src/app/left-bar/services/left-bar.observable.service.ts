import { inject, Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { BehaviorSubjectService, ObservableService } from '@shared/abstracts/observable.abstract';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { FirestorePlaylistService, FirestorePlaylistSummaryService } from './left-bar.firestore.service';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { PlayerState, Playlist, PlaylistSummary, PlaylistVideo, RepeatMode } from '../models/left-bar.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistSummaryService extends ObservableService<PlaylistSummary[]> {
  private firestore = inject(FirestorePlaylistSummaryService);
  private auth = inject(Auth);

  constructor() {
    super();
    authState(this.auth)
      .pipe(
        filter(Boolean),
        take(1),
        switchMap(() => this.load())
      )
      .subscribe(playlists => this.set$(playlists!));
  }

  private load(): Observable<PlaylistSummary[]> {
    return this.firestore.getAllByOwnerId();
  }

  public async add(name: string): Promise<PlaylistSummary> {
    const id = this.firestore.createId();
    const summary: PlaylistSummary = { id, name };
    await this.firestore.saveOrUpdate(summary);
    return summary;
  }

  public async remove(id: string): Promise<void> {
    await this.firestore.delete(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService extends BehaviorSubjectService<Playlist> {
  protected firestore = inject(FirestorePlaylistService);
  private loaded = false;

  constructor() {
    super({ videos: [] });
  }

  public load(playlistId: string): Observable<Playlist> {
    return this.firestore.getById(playlistId).pipe(
      filter(Boolean),
      take(1),
      tap(playlist => {
        this.set$(playlist ?? { id: playlistId, videos: [] });
        this.loaded = true;
      })
    );
  }

  public async removePlaylist(id: string): Promise<void> {
    await this.firestore.delete(id);
  }

  public async createPlaylist(id: string): Promise<void> {
    await this.firestore.saveOrUpdate({ id, videos: [] });
  }

  public clear(): void {
    this.loaded = false;
    this.set$({ videos: [] });
  }

  public add(video: VideoGAPI): void {
    this.update({
      ...this.value,
      videos: [...this.value.videos, this.toPlaylistVideo(video)]
    });
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
    await this.firestore.saveOrUpdate(playlist);
    this.set$(playlist);
  }

  private toPlaylistVideo(video: VideoGAPI): PlaylistVideo {
    return {
      videoId: video.videoId,
      publishedAt: video.publishedAt,
      title: video.title,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      channelId: video.channelId ?? null
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class CurrentVideoService extends BehaviorSubjectService<PlaylistVideo | null> {
  constructor() {
    super(null);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService extends BehaviorSubjectService<PlayerState> {
  constructor() {
    super(PlayerState.Unstarted);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RepeatModeService extends BehaviorSubjectService<RepeatMode> {
  constructor() {
    super(RepeatMode.None);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SuffleService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}
