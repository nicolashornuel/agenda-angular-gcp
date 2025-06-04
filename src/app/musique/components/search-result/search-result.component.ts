import { Component, Input, OnInit, inject } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { WikipediaService } from '@core/services/wikipedia.service';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { DiscogsService } from 'app/musique/services/discogs.service';
import { OrderYoutube, YoutubeService } from 'app/musique/services/youtube.service';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent extends VideoController implements OnInit {
  @Input() param!: {keyword: string, order: OrderYoutube};

  public loading: boolean = false;
  public discogs: any[] = [];
  public extractWiki?: string;
  public videos: VideoGAPI[] = [];
  public showMore: boolean = false;

  private discogsService = inject(DiscogsService);
  private wikipediaService = inject(WikipediaService);
  private youtubeService = inject(YoutubeService);

  ngOnInit(): void {
    if (this.param) {
      this.loading = true;
      forkJoin([
        this.discogsService.getByArtistName(this.param.keyword),
        this.wikipediaService.getWiki(this.param.keyword, 'fr'),
        this.wikipediaService.getWiki(this.param.keyword, 'en'),
        this.youtubeService.getVideos(this.param.keyword, this.param.order)
      ])
        .pipe(take(1))
        .subscribe(results => {
          this.discogs = results[0].results;
          this.extractWiki = results[1] ?? results[2];
          this.videos = results[3];
          this.loading = false;
        });
    }
  }

  @IsAdmin()
  public onAdd(video: VideoGAPI): void {
    const entity = { ...video };
    if (this.extractWiki) entity.extractWiki = this.extractWiki;
    this.addVideo(entity);
  }
}
