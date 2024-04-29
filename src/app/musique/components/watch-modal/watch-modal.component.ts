import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Modal } from '@shared/models/modalParam.interface';
import { FieldSet } from '@shared/models/tableSet.interface';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';

@Component({
  selector: 'app-watch-modal',
  templateUrl: './watch-modal.component.html',
  styleUrls: ['./watch-modal.component.scss']
})
export class WatchModalComponent implements Modal, OnInit {
  @Input() input!: VideoGAPI;
  output!: EventEmitter<any>;

  src: any;
  rating!: FieldSet;
  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.src = this._sanitizer.bypassSecurityTrustResourceUrl(this.input.src)
    this.rating = {
        name: 'rating',
        value: this.input.rating,
        disabled: false,
        required: false
      }
    }

}
