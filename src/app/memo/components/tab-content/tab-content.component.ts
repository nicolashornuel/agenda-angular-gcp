import { Component, HostBinding, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { FirestoreStorageService } from '@core/services/firebasestorage.service';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { DraggableListConfig } from '@shared/directives/draggable-list.directive';
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
  public innerWidth!: number;
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = inject(DestroyService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private memoService = inject(MemoService);
  private firebaseStorage = inject(FirestoreStorageService);
  private viewPortService = inject(ViewPortService);
  private _sanitizer = inject(DomSanitizer);
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

  @IsAdmin()
  public onAddField(): void {
    this.openItemModal(this.editionField, 'Créer une donnée', new AbstractField(this.list));
  }

  @IsAdmin()
  public onAddTitle(): void {
    this.openItemModal(this.editionTitle, 'Créer un titre de section', new AbstractTitle(this.list));
  }

  @IsAdmin()
  public onAddSeparator(): void {
    this.saveDocument(new AbstractSeparator(this.list));
  }

  @IsAdmin()
  public async onUp(index: number) {
    await this.reorder(index, index - 1);
  }

  @IsAdmin()
  public async onDown(index: number) {
    await this.reorder(index + 1, index);
  }

  @IsAdmin()
  public onSave(document: AbstractField): void {
    this.saveDocument(document);
  }

  @IsAdmin()
  public onEditField(item: AbstractField) {
    this.openItemModal(this.editionField, 'Modifier une donnée', item);
  }

  @IsAdmin()
  public onEditTitle(item: AbstractField) {
    this.openItemModal(this.editionTitle, 'Modifier une donnée', item);
  }

  @IsAdmin()
  public async onDelete(item: AbstractField) {
    await this.memoService.delete(item.id!);
    if (item.type.name === AbstractField.FILE.name) await this.firebaseStorage.delete(this.routePath, item.value.name);
    this.alertService.success('suppression réussie');
  }

  public draggableSave(): (items: AbstractField[]) => void {
    return (items: AbstractField[]) => Promise.all(
      items.map(
        async (item, i) =>
          await this.saveDocument({
            ...item,
            order: i
          })
      )
    ).then(() => this.alertService.success('Nouvel arrangement sauvegardé'));
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
    if (document.type.name === AbstractField.FILE.name || document.type.name === AbstractField.IMG.name) {
      await this.firebaseStorage.storeFile(this.routePath, document.value);
      document.value = { ...document.value };
    }
    if (document.type.name === AbstractField.HTML.name) {
      delete document.safeHtml;
    }
    await this.memoService.saveOrUpdate(document);
  }

  private sortDesc(list: AbstractField[]): void {
    this.list = [...list] // éviter la mutation de l’original
      .sort((a, b) => a.order - b.order)
      .map(item =>
        item.type.name === AbstractField.HTML.name && typeof item.value === 'string'
          ? { ...item, safeHtml: this._sanitizer.bypassSecurityTrustHtml(item.value) }
          : item
      );
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
