import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { limit, orderBy, QueryConstraint, where } from '@angular/fire/firestore';
import { FirestoreService } from '@core/services/firestore.service';
import { map, Observable } from 'rxjs';
import { Playlist, PlaylistSummary } from '../models/left-bar.model';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestorePlaylistService extends FirestoreService<Playlist> {
  constructor() {
    super('playlists');
  }
}

@Injectable({
  providedIn: 'root'
})
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

@Injectable({
  providedIn: 'root'
})
export class FirestoreVideoCenterService extends FirestoreService<VideoGAPI> {
  constructor() {
    super('videoCenter');
  }

  public getLatest(limitCount = 10): Observable<VideoGAPI[]> {
    const constraints: QueryConstraint[] = [orderBy('addedAt', 'desc'), limit(limitCount)];
    return this.get(constraints);
  }

  public getTopRated(limitCount = 10): Observable<VideoGAPI[]> {
    const constraints: QueryConstraint[] = [orderBy('rating', 'desc'), limit(limitCount)];
    return this.get(constraints);
  }
}
