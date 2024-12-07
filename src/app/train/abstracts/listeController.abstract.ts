import { Directive, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ActionSet, ColumnSet, FieldSet, TableSet } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';

@Directive({
  selector: '[appListe]'
})
export abstract class ListeController<T> implements OnInit {

  @ViewChild('modal') modal!: TemplateRef<Modal>;
  
  public isLoading!: boolean;
  public tableSet!: TableSet;
  public popoverTitle!: string;
  public popoverFieldSets!: FieldSet[];
  public destroy$ = inject(DestroyService);
  private modalService = inject(ModalService);

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

  protected abstract getColumnSet(): ColumnSet[];
  protected abstract getActionSet(): ActionSet[];
  protected abstract initData(): void;
  public abstract onEdit(row: T): void;
  public abstract onDelete(row: T): void;
  public abstract onCreate(): void;
  public abstract onSave(t: T): void;
 
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

/*   private initData() {
    this.isLoading = true;
    this.reservationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((t: any[]) => {
        this.tableSet.data = this.mapData(t);
        this.isLoading = false;
      });
  } */
  
}
