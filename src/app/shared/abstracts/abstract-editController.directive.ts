import { Directive, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ModalService } from '@shared/services/shared.observable.service';
import { Identifiable } from '../../train/models/reservation.model';

@Directive({
  selector: '[appListe]'
})
export abstract class EditController<T extends Identifiable> implements OnInit {
  @Input() input!: T;
  @Output() output = new EventEmitter<T>();
  
  public modalService = inject(ModalService);

  ngOnInit(): void {
    this.initComponents();
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  public onSave(): void {
    this.output.emit(this.input);
    this.modalService.set$(undefined);
  }

  protected abstract initComponents(): void;
}
