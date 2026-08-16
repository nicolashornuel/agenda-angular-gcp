import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/abstracts/firestore.abstract';
import { VideoGAPI } from '../models/musique.interface';

@Injectable()
export class VideoService extends FirestoreService<VideoGAPI> {
  constructor() {
    super('videoCenter');
  }
}