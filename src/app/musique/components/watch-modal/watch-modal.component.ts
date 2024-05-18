import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FieldSet } from '@shared/models/tableSet.interface';
import { Modal } from '@shared/services/modal.service';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';

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

  ngOnInit(): void {
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
      rating: this.rating.value as number
    };
    this.updateVideo(inputChanged);
    this.closeModal();
  }

}
