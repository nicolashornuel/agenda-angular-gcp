import { Component, Input, OnInit, inject } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { WikipediaService } from '@core/services/wikipedia.service';
import { Nameable } from '@shared/models/fieldSet.model';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { DiscogsService } from 'app/musique/services/discogs.service';
import { YoutubeService } from 'app/musique/services/youtube.service';
import { finalize, forkJoin } from 'rxjs';

export type SearchType = 'keyword' | 'channelId' | 'channelTitle';

export interface SearchParam extends Nameable {
  type: SearchType;
  q: string;
}

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent extends VideoController implements OnInit {
  @Input() param!: SearchParam;

  public loading: boolean = false;
  public discogs: any[] = [];
  public extractWiki?: string;
  public videos: VideoGAPI[] = [];

  private discogsService = inject(DiscogsService);
  private wikipediaService = inject(WikipediaService);
  private youtubeService = inject(YoutubeService);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;

    switch (this.param.type) {
      case 'channelId':
        this.loadChannelId(this.param.q);
        break;

      case 'channelTitle':
        this.loadChannelTitle(this.param.q);
        break;

      case 'keyword':
        this.loadKeyword(this.param.q);
        break;
    }
  }

  private loadChannelId(channelId: string): void {
    this.youtubeService
      .getVideosFromChannelId(channelId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(videos => (this.videos = videos));
  }

  private loadChannelTitle(channelTitle: string): void {
    this.youtubeService
      .getVideosFromChannelName(channelTitle)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(videos => (this.videos = videos));
  }

  private loadKeyword(keyword: string): void {
    forkJoin([
      //this.discogsService.getByArtistName(keyword),
      this.wikipediaService.getWiki(keyword, 'fr'),
      this.wikipediaService.getWiki(keyword, 'en'),
      this.youtubeService.getVideos(keyword)
    ])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(results => {
        //this.discogs = results[0].results;
        this.discogs = [];
        this.extractWiki = results[0] ?? results[1];
        this.videos = results[2];
      });
  }

  @IsAdmin()
  public onAdd(video: VideoGAPI): void {
    const entity = { ...video };
    if (this.extractWiki) entity.extractWiki = this.extractWiki;
    this.addVideo(entity);
  }
}
