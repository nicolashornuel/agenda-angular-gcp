import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {VideoGAPI} from 'app/musique/models/videoGAPI.interface';
import {DiscogsService} from 'app/musique/services/discogs.service';
import {WikipediaService} from 'app/musique/services/wikipedia.service';
import {YoutubeService} from 'app/musique/services/youtube.service';
import {forkJoin, take} from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnChanges {
  @Input() keyword!: string;

  loading: boolean = false;
  discogs: any[] = [];
  extractWiki?: string;
  videos: VideoGAPI[] = [];

  constructor(
    private discogsService: DiscogsService,
    private wikipediaService: WikipediaService,
    private youtubeService: YoutubeService
  ) {}

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.keyword) {
      this.loading = true;
      forkJoin([
        this.discogsService.getByArtistName(this.keyword),
        this.wikipediaService.getWiki(this.keyword, 'fr'),
        this.wikipediaService.getWiki(this.keyword, 'en'),
        this.youtubeService.getVideos(this.keyword)
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
}
