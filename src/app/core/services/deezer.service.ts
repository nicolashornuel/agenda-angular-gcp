import { inject, Injectable } from '@angular/core';
import { AbstractFetchFunctionService } from './abstractFetchFunction.service';

@Injectable({
  providedIn: 'root'
})
export class DeezerService {
  private readonly fetchFunction = inject(AbstractFetchFunctionService);
  public favoritePlaylists = [
    { name: 'Top France', id: '1109890291' },
    { name: 'Les titres du moment', id: '53362031' },
    { name: 'Electronic Hits', id: '1902101402' }
  ];

  public async getPlaylist(id: string): Promise<DeezerPlaylist> {
    const response = await this.fetchFunction.getJson(`https://api.deezer.com/playlist/${id}`);
    return DeezerPlaylist.fromJson(response.data);
  }
}

export class DeezerPlaylist {
  constructor(
    public creator: DeezerArtist,
    public nb_tracks: number,
    public title: string,
    public tracks: DeezerTrack[],
    public add_date: string,
    public picture_medium: string
  ) {}

  static fromJson(data: any): DeezerPlaylist {
    return new DeezerPlaylist(
      data.creator,
      data.nb_tracks,
      data.title,
      data.tracks.data.map((track: any) => DeezerTrack.fromJson(track)),
      data.add_date,
      data.picture_medium
    );
  }
}

export class DeezerTrack {
  constructor(
    public title: string,
    public preview: string,
    public duration: number,
    public rank: number,
    public artist: DeezerArtist,
    public album: DeezerAlbum
  ) {}

  static fromJson(data: any): DeezerTrack {
    return new DeezerTrack(
      data.title,
      data.preview,
      data.duration,
      data.rank,
      {
        name: data.artist.name,
        tracklist: data.artist.tracklist
      },
      {
        title: data.album.title,
        tracklist: data.album.tracklist,
        cover_medium: data.album.cover_medium
      }
    );
  }
}

export interface DeezerArtist {
  name: string;
  tracklist: string;
}

export interface DeezerAlbum {
  title: string;
  tracklist: string;
  cover_medium: string;
}
