import { Directive, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FieldSet } from '@shared/models/fieldSet.model';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ActionSet, ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { AlertService } from '@shared/services/alert.service';
import { ColumnsortableService } from '@shared/services/columnsortable.service';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { Identifiable } from '../../train/models/reservation.model';

@Directive({
  selector: '[appListe]'
})
export abstract class ListController<T extends Identifiable> implements OnInit {

  @ViewChild('modal') modal!: TemplateRef<Modal>;
  @ViewChild('confirm') confirm!: TemplateRef<Modal>;
  
  public isLoading!: boolean;
  public tableSet!: TableSet;
  public popoverTitle!: string;
  public popoverFieldSets!: FieldSet[];
  public destroy$ = inject(DestroyService);
  public modalService = inject(ModalService);
  public alertService = inject(AlertService);
  public colSortable = inject(ColumnsortableService);

  ngOnInit(): void {
    this.initComponents();
    this.initData();
  }

  public onShowColumn(value: boolean, fieldSet: FieldSet) {
    this.tableSet.columnSet!.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible = value;
  }

  public onOpenModal(title: string, t?: T): void {
    const modalParam: ModalParam<T> = {
      title,
      context: { $implicit: t },
      template: this.modal
    };
    this.modalService.set$(modalParam);
  }

  public onOpenConfirm(title: string, t?: T): void {
    const modalParam: ModalParam<T> = {
      title,
      context: { $implicit: t },
      template: this.confirm,
      maxWidth: '400px'
    };
    this.modalService.set$(modalParam);
  }

  public onClose(): void {
    this.modalService.set$(undefined);
  }

  protected abstract getColumnSet(): ColumnSet[];
  protected abstract getActionSet(): ActionSet[];
  protected abstract initData(): void;
  public abstract onCreate(): void;
  public abstract onSave(t: T): Promise<void>;
 
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
      (col: ColumnSet) => new FieldSet({name: col.title}, col.visible)
    );
  }
}
