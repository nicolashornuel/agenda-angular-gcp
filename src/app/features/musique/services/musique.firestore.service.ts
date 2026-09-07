import { inject, Injectable } from '@angular/core';
import { FirestoreService } from '@core/abstracts/firestore.abstract';
import { Playlist, PlaylistSummary, VideoGAPI } from '../models/musique.interface';
import { Auth } from '@angular/fire/auth';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable()
export class VideoService extends FirestoreService<VideoGAPI> {
  constructor() {
    super('videoCenter');
  }
}

@Injectable()
export class FirestorePlaylistService extends FirestoreService<Playlist> {
  constructor() {
    super('playlists');
  }
}

@Injectable()
export class FirestorePlaylistSummaryService extends FirestoreService<PlaylistSummary> {
  private auth = inject(Auth);

  constructor() {
    super('playlistSummary');
  }

  public getAllByOwnerId(ownerId: string): Observable<PlaylistSummary[]> {
    const constraints: QueryConstraint[] = [where('ownerId', '==', ownerId)];
    return this.get(constraints).pipe(map(playlists => playlists.map(({ id, name }) => ({ id, name }))));
  }

  public override async saveOrUpdate(playlist: PlaylistSummary): Promise<void> {
    const ownerId = this.auth.currentUser?.uid;
    if (!ownerId) throw new Error('Utilisateur non authentifié');
    await super.saveOrUpdate({ ...playlist, ownerId });
  }
}