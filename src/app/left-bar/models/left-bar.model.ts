import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { Nameable } from '@shared/models/fieldSet.model';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';


export interface PlaylistSummary extends Nameable, Identifiable {
  ownerId?: string;
}

export interface Playlist extends Identifiable {
  videos: PlaylistVideo[];
}

export type PlaylistVideo = Pick<
  VideoGAPI,
  'videoId' | 'publishedAt' | 'title' | 'thumbnail' | 'channelTitle' | 'channelId'
>;

export enum PlayerState {
  Unstarted = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Cued = 5
}

export enum RepeatMode {
  None,
  All,
  One
}

export const VISITOR_PLAYLIST_ID = '__visitor__';

export const VISITOR_PLAYLIST_SUMMARY: PlaylistSummary = {
  id: VISITOR_PLAYLIST_ID,
  name: 'Visiteur'
};

export const VISITOR_PLAYLIST: Playlist = {
  id: VISITOR_PLAYLIST_ID,
  videos: []
};