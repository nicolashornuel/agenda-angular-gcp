import { VideoGAPI } from '@features/musique/models/musique.interface';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { Nameable } from '@shared/models/fieldSet.model';


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