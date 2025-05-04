import { Component, inject, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Modal } from '@shared/models/modalParam.interface';
import { FieldSet } from '@shared/models/fieldSet.model';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { YoutubeService } from 'app/musique/services/youtube.service';

@Component({
  selector: 'app-watch-modal',
  templateUrl: './watch-modal.component.html',
  styleUrls: ['./watch-modal.component.scss']
})
export class WatchModalComponent extends VideoController implements Modal, OnInit {
  @Input() input!: VideoGAPI;
  public src!: SafeResourceUrl;
  public rating!: FieldSet;
  public categorie!: FieldSet;
  public categories!: Set<string>;
    private youtubeService = inject(YoutubeService);
    public loading: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.youtubeService.getViewCount(this.input.videoId).subscribe(({ viewCount, likeCount }) => {
      this.input.viewCount = viewCount;
      this.input.likeCount = likeCount;
      this.loading = false;
    });

    this.src = this.sanitizeUrl(this.input.src);
    this.rating = {
      name: 'rating',
      value: this.input.rating,
      disabled: false,
      required: false
    };
    this.categorie = {
      name: 'categorie',
      value: this.input.categorie,
      disabled: false,
      required: false
    };
    this.getCategories().subscribe(categories => (this.categories = categories));
  }

  public onDelete(): void {
    this.deleteVideo(this.input);
  }

  public onSave(): void {
    const inputChanged: VideoGAPI = {
      ...this.input,
      categorie: this.categorie.value as string,
      rating: this.rating.value as number ?? 0
    };
    delete inputChanged.sanitized;
    inputChanged.id ? this.updateVideo(inputChanged) : this.addVideo(inputChanged);
  }

}
