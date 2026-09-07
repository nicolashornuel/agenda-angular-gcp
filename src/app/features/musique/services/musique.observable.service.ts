import { inject, Injectable } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { Playlist, PlaylistSummary, PlaylistVideo, VISITOR_PLAYLIST_ID, VISITOR_PLAYLIST_SUMMARY } from '@features/left-bar/models/left-bar.model';
import { FirestorePlaylistService, FirestorePlaylistSummaryService } from '@features/left-bar/services/left-bar.firestore.service';
import { BehaviorSubjectService, ObservableService, SubjectService } from '@shared/abstracts/observable.abstract';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { SearchParam } from '../components/search-result/search-result.component';
import { VideoGAPI } from '../models/musique.interface';
import { Auth, authState, User } from '@angular/fire/auth';

@Injectable()
export class TabResultService extends SubjectService<SearchParam> {}

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