import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreStorageService } from '@core/services/firebasestorage.service';
import { Selectable } from '@shared/models/fieldSet.model';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { AlertService } from '@shared/services/alert.service';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { AbstractDisplay, AbstractField, AbstractItem, AbstractSection, MemoService } from 'app/memo/service/memo.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  public isLoading!: boolean;
  public list!: AbstractField[];
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = inject(DestroyService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private memoService = inject(MemoService);
  private firebaseStorage = inject(FirestoreStorageService);
  private routePath!: string;
  @ViewChild('editionField') editionField!: TemplateRef<Modal>;
  @ViewChild('editionSection') editionSection!: TemplateRef<Modal>;

  ngOnInit(): void {
      this.routePath = this.activatedRoute.snapshot.routeConfig!.path!;
      this.memoService.setCollection(this.routePath);
      this.initData();
  }

  private initData(): void {
    this.isLoading = true;
    this.memoService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.sortDesc(list);
        this.isLoading = false;
      });
  }

  public onCreate(): void {
    this.onOpenFieldModal('Créer une donnée', new AbstractField(this.list));
  }

  private addDisplayItem(type: Selectable<string>): void {
    const item = new AbstractDisplay(this.list, type);
    this.saveDocument(item);
  }

  public onAddSeparator(): void {
    this.addDisplayItem(AbstractDisplay.SEPARATOR);
  }

  public onAddSectionTitle(): void {
    this.onOpenSectiondModal('Créer un titre de section', new AbstractSection(this.list, AbstractSection.TITLE));
  }

  public onOpenFieldModal(title: string, t?: AbstractItem): void {
    const modalParam: ModalParam<AbstractItem> = {
      title,
      context: { $implicit: t },
      template: this.editionField,
      maxWidth: '400px'
    };
    this.modalService.set$(modalParam);
  }

  public onOpenSectiondModal(title: string, t?: AbstractItem): void {
    const modalParam: ModalParam<AbstractItem> = {
      title,
      context: { $implicit: t },
      template: this.editionSection,
      maxWidth: '400px'
    };
    this.modalService.set$(modalParam);
  }

  public onSave(document: AbstractField): void {
    this.saveDocument(document);
  }

  private async saveDocument(document: AbstractItem): Promise<void> {
    if (document.type === AbstractField.FILE) {
      await this.firebaseStorage.storeFile(this.routePath, document.value);
      document.value = { ...document.value };
    }
    await this.memoService.saveOrUpdate(document);
  }

  private sortDesc(list: AbstractField[]): void {
    this.list = list.sort((a, b) => a.order - b.order);
  }

  public async onUp(index: number) {
    await this.reorder(index, index - 1);
  }

  public async onDown(index: number) {
    await this.reorder(index + 1, index);
  }

  private async reorder(toUp: number, toDown: number): Promise<void> {
    const prevOrder = this.list[toDown].order;
    const nextOrder = this.list[toUp].order;
    this.list[toUp].order = prevOrder;
    this.list[toDown].order = nextOrder;
    await this.saveDocument(this.list[toUp]);
    await this.saveDocument(this.list[toDown]);
  }

  public onEdit(item: AbstractField) {
    this.onOpenFieldModal('Modifier une donnée', item);
  }

  public async onDelete(item: AbstractField) {
    await this.memoService.delete(item.id!);
    if (item.type === AbstractField.FILE) await this.firebaseStorage.delete(this.routePath, item.value.name);
    this.alertService.success('suppression réussie');
  }
}
