import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/modal.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit  {

  @Input() title: string | null | undefined;
  @Output() close = new EventEmitter<void>;

  public onClose(): void {
    this.close.emit();
    this.modalService.set$(undefined);
  }


    param: ModalParam | null | undefined;
  
    constructor(private modalService: ModalService, private destroy$: DestroyService) {}
  
    ngOnInit(): void {
      this.modalService.get$
        .pipe(takeUntil(this.destroy$))
        .subscribe((param) => (this.param = param));
    }

}
