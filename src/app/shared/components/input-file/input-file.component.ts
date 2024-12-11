import { Component, EventEmitter, Input, OnInit, Output, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { FileStorage } from '@core/services/firebasestorage.service';
import { AbstractInputComponent } from '@shared/abstracts/input.component';

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
export class InputFileComponent extends AbstractInputComponent implements OnInit {
  @Input() fileStorage!: FileStorage;
  @Output() fileStorageChange = new EventEmitter<FileStorage>();
  public src?: SafeResourceUrl;
  public isLoading!: boolean;
  private _sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    if (this.fileStorage && this.fileStorage.link) this.load(this.fileStorage.link);
  }

  public onFileChange(event: any): void {
    const file = event.target.files.item(0);
    // si on annule file est null
    if (file) {
      const reader = new FileReader();
      this.isLoading = true;
      reader.addEventListener('load', () => {
        this._getSrc(reader.result as string);
        this.isLoading = false;
      });
      reader.readAsDataURL(file);
      // on garde en mémoire avant de stocker
      this.fileStorageChange.next(new FileStorage(file));
    }
  }

  private _getSrc(link: string): void {
    this.src = this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  private load(link: string): void {
    this.fileStorage.type === "application/pdf" ? this.loadPdf(link) : this.loadImage(link);
  }

  private async loadPdf(link: string): Promise<void> {
    this._getSrc(link);
  }

  private loadImage(link: string): void {
    const img = new Image();
    this.isLoading = true;
    img.onload = (e) => {
      this._getSrc(link);
      this.isLoading = false;
    };
    img.src = link;
  }
}
