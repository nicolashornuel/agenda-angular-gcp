import { Component, inject, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { FieldSet } from '@shared/models/fieldSet.model';
import { Modal } from '@shared/models/modalParam.interface';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { YoutubeConvertService } from 'app/musique/services/youtube-convert.service';
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
  private youtubeConvert = inject(YoutubeConvertService);
  public loading: boolean = false;
  public isConverting: boolean = false;

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

  @IsAdmin()
  public onDelete(): void {
    this.deleteVideo(this.input);
  }

  @IsAdmin()
  public onSave(): void {
    const inputChanged: VideoGAPI = {
      ...this.input,
      categorie: this.categorie.value as string,
      rating: (this.rating.value as number) ?? 0
    };
    delete inputChanged.sanitized;
    inputChanged.id ? this.updateVideo(inputChanged) : this.addVideo(inputChanged);
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
