import { Component, HostBinding, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreStorageService } from '@core/services/firebasestorage.service';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { AlertService } from '@shared/services/alert.service';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService, ViewPortService } from '@shared/services/shared.observable.service';
import { AbstractField, AbstractTitle, AbstractSeparator, AbstractItem } from 'app/memo/models/memo.model';
import { MemoService } from 'app/memo/service/memo.service';
import { combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  public isLoading!: boolean;
  public list: AbstractField[] = [];
  public innerWidth!: number
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = inject(DestroyService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private memoService = inject(MemoService);
  private firebaseStorage = inject(FirestoreStorageService);
  private viewPortService = inject(ViewPortService);
  private routePath!: string;
  @ViewChild('editionField') editionField!: TemplateRef<Modal>;
  @ViewChild('editionTitle') editionTitle!: TemplateRef<Modal>;
  @HostBinding('class')
  get additionalClasses() {
    return 'relative';
  }

  ngOnInit(): void {
    this.routePath = this.activatedRoute.snapshot.routeConfig!.path!;
    this.memoService.setCollection(this.routePath);
    this.initData();
  }

  private initData(): void {
    this.isLoading = true;
    combineLatest([this.memoService.getAll(), this.viewPortService.get$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(values => {
      this.sortDesc(values[0]);
      this.innerWidth = values[1]!;
      this.isLoading = false;
    });
  }

  /////////////////////////////////////// EVENTS

  public onAddField(): void {
    this.openItemModal(this.editionField, 'Créer une donnée', new AbstractField(this.list));
  }

  public onAddTitle(): void {
    this.openItemModal(this.editionTitle, 'Créer un titre de section', new AbstractTitle(this.list));
  }

  public onAddSeparator(): void {
    this.saveDocument(new AbstractSeparator(this.list));
  }

  public async onUp(index: number) {
    await this.reorder(index, index - 1);
  }

  public async onDown(index: number) {
    await this.reorder(index + 1, index);
  }

  public onSave(document: AbstractField): void {
    this.saveDocument(document);
  }

  public onEditField(item: AbstractField) {
    this.openItemModal(this.editionField, 'Modifier une donnée', item);
  }

  public onEditTitle(item: AbstractField) {
    this.openItemModal(this.editionTitle, 'Modifier une donnée', item);
  }

  public async onDelete(item: AbstractField) {
    await this.memoService.delete(item.id!);
    if (item.type === AbstractField.FILE) await this.firebaseStorage.delete(this.routePath, item.value.name);
    this.alertService.success('suppression réussie');
  }

  /////////////////////////////////////// SHARED PRIVATE

  private openItemModal(modal: TemplateRef<Modal>, title: string, t: AbstractItem): void {
    const modalParam: ModalParam<AbstractItem> = {
      title,
      context: { $implicit: t },
      template: modal,
      maxWidth: '400px'
    };
    this.modalService.set$(modalParam);
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

  private async reorder(toUp: number, toDown: number): Promise<void> {
    const prevOrder = this.list[toDown].order;
    const nextOrder = this.list[toUp].order;
    this.list[toUp].order = prevOrder;
    this.list[toDown].order = nextOrder;
    this.saveDocument(this.list[toUp]);
    this.saveDocument(this.list[toDown]);
  }
}
