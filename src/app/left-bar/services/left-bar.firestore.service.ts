import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { FirestoreService } from '@core/services/firestore.service';
import { map, Observable } from 'rxjs';
import { Playlist, PlaylistSummary } from '../models/left-bar.model';

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
