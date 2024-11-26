import { Directive, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ActionSet, ColumnSet, FieldSet, TableSet } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { takeUntil } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { STATIONS, SncfService } from '../services/sncf.service';

@Directive({
  selector: '[appListe]'
})
export abstract class ListeDirective<T> implements OnInit {

  @ViewChild('modal') modal!: TemplateRef<Modal>;
  
  public isLoading!: boolean;
  public tableSet!: TableSet;
  public popoverTitle!: string;
  public popoverFieldSets!: FieldSet[];
  
  constructor(
    private reservationService: ReservationService,
    private destroy$: DestroyService,
    private modalService: ModalService,
    private sncfService: SncfService
  ) {}

  ngOnInit(): void {
    this.sncfService.getDepartures(STATIONS[0].id).pipe(takeUntil(this.destroy$)).subscribe(res => console.log(res));
    this.initComponents();
    this.initData();
  }

  public onShowColumn(value: boolean, fieldSet: FieldSet) {
    this.tableSet.columnSet!.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible = value;
  }

  public async onDelete(id: string): Promise<void> {}
  public async onEdit(row: T): Promise<void> {
    this.onOpenModal(row);
  }
  public async onSave(id: string): Promise<void> {}
  public async onCancel(id: string): Promise<void> {}

  public onAdd(t: T) {}

  public onOpenModal(row: T | undefined): void {
    const modalParam: ModalParam = {
      title: 'Ajouter une réservation',
      context: { $implicit: row },
      template: this.modal
    };
    this.modalService.set$(modalParam);
  }

  protected abstract getColumnSet(): ColumnSet[];
  protected abstract getActionSet(): ActionSet[];
  protected abstract mapData(list: any[]): T[];

  private initComponents() {
    this.tableSet = {
      verticaltextHeader: false,
      hover: false,
      height: 'calc(100vh - 240px)',
      columnSet: this.getColumnSet(),
      actionSet: this.getActionSet(),
      data: []
    };
    this.popoverTitle = 'colonne visible';
    this.popoverFieldSets = this.tableSet.columnSet.map(
      (col: ColumnSet) => new FieldSet(col.title, col.visible)
    );
  }

  private initData() {
    this.isLoading = true;
    this.reservationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((t: any[]) => {
        this.tableSet.data = this.mapData(t);
        this.isLoading = false;
      });
  }
  
}
