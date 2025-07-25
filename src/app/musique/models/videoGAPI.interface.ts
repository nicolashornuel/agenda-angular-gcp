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
  likeCount: number;
}
