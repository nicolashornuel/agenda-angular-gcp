import { Identifiable } from "@shared/abstracts/abstract-controller.directive";
import { Nameable } from "@shared/models/fieldSet.model";

export interface VideoGAPI {
  id: string;
  videoId: string;
  publishedAt: Date;
  addedAt?: Date | string;
  updatedAt?: Date | string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  src: string;
  categorie: string;
  extractWiki?: string;
  rating: number;
  discogs: any;
  viewCount: number;
  likeCount?: number;
  channelId: string;
}

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