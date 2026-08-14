import { Component, inject, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { Modal } from '@shared/models/modalParam.interface';
import { VideoController } from 'app/features/musique/abstracts/videoController.abstract';
import { YoutubeConvertService } from '@core/services/youtube-convert.service';
import { YoutubeSearchService } from '@core/services/youtube-search.service';
import { VideoGAPI } from '@features/musique/models/musique.interface';

@Component({
  selector: 'app-watch-modal',
  templateUrl: './watch-modal.component.html',
  styleUrls: ['./watch-modal.component.scss']
})
export class WatchModalComponent extends VideoController implements Modal, OnInit {
  @Input() input!: VideoGAPI;
  public src!: SafeResourceUrl;
  public categories!: Set<string>;
  private router = inject(Router);
  private youtubeSearch = inject(YoutubeSearchService);
  private youtubeConvert = inject(YoutubeConvertService);
  public loading: boolean = false;
  public isConverting: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.youtubeSearch.getViewCount(this.input.videoId).subscribe(({ viewCount, likeCount }) => {
      this.input.viewCount = viewCount ?? 0;
      this.input.likeCount = likeCount ?? 0;
      this.loading = false;
    });
    this.src = this.sanitizeUrl(this.input.src);
    this.getCategories().subscribe(categories => (this.categories = categories));
  }

  public onOpenChannel() {
    const { channelId, channelTitle } = this.input;
    this.router.navigate(['/musique'], { queryParams: { channelId, channelTitle } });
    this.closeModal();
  }

  @IsAdmin()
  public onDelete(): void {
    this.deleteVideo(this.input);
  }

  @IsAdmin()
  public onSave(): void {
    this.input.id ? this.updateVideo(this.input) : this.addVideo(this.input);
  }

  @IsAdmin()
  public loadCookies(event: Event): void {
    this.isConverting = true;

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => this.convertVideo(reader.result as string);

    reader.readAsText(file);
  }

  private convertVideo(cookie: string): void {
    this.youtubeConvert.convertYoutubeToMp3(this.input.videoId, cookie).subscribe(
      blob => {
        // Créer un lien de téléchargement
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `${this.input.title}.mp3`; // Nom du fichier
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.isConverting = false;
      },
      _error => (this.isConverting = false)
    );
  }
}
