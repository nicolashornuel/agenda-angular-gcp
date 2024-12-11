import { Directive, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';
import { FieldSet } from '@shared/models/fieldSet.model';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ActionSet, ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { Identifiable } from '../models/reservation.model';
import { AlertService } from '@shared/services/alert.service';

@Directive({
  selector: '[appListe]'
})
export abstract class ListeController<T extends Identifiable> implements OnInit {

  @ViewChild('modal') modal!: TemplateRef<Modal>;
  @ViewChild('confirm') confirm!: TemplateRef<Modal>;
  
  public isLoading!: boolean;
  public tableSet!: TableSet;
  public popoverTitle!: string;
  public popoverFieldSets!: FieldSet[];
  public destroy$ = inject(DestroyService);
  public modalService = inject(ModalService);
  private alertService = inject(AlertService);

  public firestoreService!: FirestoreService<T>;

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
      (col: ColumnSet) => new FieldSet({name: col.title}, col.visible)
    );
  }

  async update(t: T): Promise<void> {
    await this.firestoreService.update(t, t.id!);
    this.alertService.success(`Modification id:${t.id}`);
  }

  async add(t: T): Promise<void> {
    t.id = await this.firestoreService.save(t);
    this.alertService.success(`Création id:${t.id}`);
  }

  async delete(t: T): Promise<void> {
    await this.firestoreService.delete(t.id!);
    this.alertService.success(`Suppression id:${t.id}`);
  }
}
