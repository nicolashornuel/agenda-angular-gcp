import { Component, EventEmitter, Input, OnInit } from '@angular/core';
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
  output!: EventEmitter<any>;

  src!: SafeResourceUrl;
  rating!: FieldSet;
  categorie!: FieldSet;
  categories!: Set<string>;

  async ngOnInit(): Promise<void> {
    this.src = this.sanitizeUrl(this.input.src);
    this.rating = {
      name: 'rating',
      value: this.input.rating,
      disabled: false,
      required: false
    }
    this.categories = await this.getCategories();
    this.categorie = {
      name: 'categorie',
      value: this.input.categorie,
      disabled: false,
      required: false
    }
    }

    public updateCategorie(event: any): void {
      console.log(event);
      
    }

    public onDelete(): void {
      this.deleteVideo(this.input);
      
    }

}
