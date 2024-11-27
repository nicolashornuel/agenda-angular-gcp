import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { FileStorage } from 'app/train/models/reservation';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true
    }
  ]
})
export class InputFileComponent extends AbstractInputComponent {

  @Input() fileStorage!: FileStorage;
  @Output() onFileChange = new EventEmitter<any>();

  public onValueChange(event: any): void {
    this._value = event.target.files[0]
    this.onFileChange.next(event)
  }

}

