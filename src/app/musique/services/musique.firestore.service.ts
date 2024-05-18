import { Injectable } from '@angular/core';
import { FirestoreService } from 'app/core/services/firestore.service';
import { VideoGAPI } from '../models/videoGAPI.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService extends FirestoreService<VideoGAPI> {
  constructor() {
    super('videoCenter');
  }
}