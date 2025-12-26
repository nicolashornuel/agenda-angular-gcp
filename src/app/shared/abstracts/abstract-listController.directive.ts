import { Directive, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, inject } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { FirestoreService, Pageable } from '@core/services/firestore.service';
import { DataSelect, FieldSet, Selectable } from '@shared/models/fieldSet.model';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ActionSet, ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { AlertService } from '@shared/services/alert.service';
import { ColSorted, ColumnsortableService } from '@shared/services/columnsortable.service';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/shared.observable.service';
import { UtilService } from '@shared/services/util.service';
import { map, takeUntil, tap } from 'rxjs';
import { Identifiable } from '../../train/models/reservation.model';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';

@Directive({
  selector: '[appListe]'
})
export abstract class ListController<T extends Identifiable> implements OnInit, OnChanges {
  @ViewChild('modal') modal!: TemplateRef<Modal>;
  @ViewChild('confirm') confirm!: TemplateRef<Modal>;

  public isLoading!: boolean;
  public isSaving!: boolean;
  public tableSet!: TableSet;
  public popoverTitle!: string;
  public popoverFieldSets!: FieldSet[];
  public destroy$ = inject(DestroyService);
  public modalService = inject(ModalService);
  public alertService = inject(AlertService);
  public colSortable = inject(ColumnsortableService);
  public utilService = inject(UtilService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected abstract getColumnSet(): ColumnSet[];
  protected abstract getActionSet(): ActionSet[];
  protected abstract initData(): void;
  public abstract onCreate(): void;
  protected abstract firestoreService: FirestoreService<T>;

  ngOnInit(): void {
    this.initComponents();
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input'] && !changes['input'].firstChange) this.initData();
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

  @IsAdmin()
  public async onConfirmDelete(row: T): Promise<void> {
    this.isSaving = true;
    await this.firestoreService!.delete(row.id!);
    this.modalService.set$(undefined);
    this.alertService.success('suppression réussie');
    this.isSaving = false;
  }

  @IsAdmin()
  public async onSave(t: T): Promise<void> {
    this.isSaving = true;
    await this.firestoreService!.saveOrUpdate(t);
    this.modalService.set$(undefined);
    this.alertService.success('Enregistrement réussie');
    this.isSaving = false;
  }

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
      (col: ColumnSet) => new FieldSet({ name: col.title }, col.visible)
    );
  }

  // ------------------------------- PAGINATION & FILTER :

  public filter!: DataSelect<string>;
  private readonly pageSize = 20;
  protected colSorted!: ColSorted;
  public hasNext!: boolean;
  public hasPrev!: boolean;
  public totalCount!: number;
  protected toDto?(t: T[]): any[];
  private lastDocId: string | null = null;

  protected initColSorted(colSorted: ColSorted): void {
    this.colSorted = colSorted;
  }

  protected initPagination(): void {
    this.colSortable.setColumnSort$(this.colSorted);
    this.onFirstPage();
    this.colSortable.getColumnSort$.pipe(takeUntil(this.destroy$)).subscribe((colSorted: ColSorted | undefined) => {
      colSorted ? (this.colSorted = colSorted) : undefined;
      this.getByQuery();
    });
    this.firestoreService.getCountFromServer().then(count => this.totalCount = count);
  }

  protected initDataFilter(options: Selectable<any>[]): void {
    options.unshift(new Selectable('Toutes catégories', 'Toutes catégories'));
    this.filter = new DataSelect({ key: 'categorie', name: 'Filtrer par catégories' }, options);
    this.filter.value = this.filter.options[0];
  }

  protected getByQuery(): void {
    this.isLoading = true;
    this.filter === undefined || this.filter?.value.value === 'Toutes catégories'
      ? this.onFirstPage()
      : this.firestoreService
          .getByQuery(this.colSorted, { key: this.filter.value.value.key, value: this.filter.value.value.value })
          .subscribe(items => this.defineData({ items: items, hasNext: false, hasPrevious: false }));
  }

  protected getRouteParms(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params: ParamMap) => {
      if (params.get('order-by')) this.colSorted.fieldPath = params.get('order-by')!;
      if (params.get('order-direction')) this.colSorted.directionStr = params.get('order-direction') as 'asc' | 'desc';
      if (params.get('filter-key')) this.filter.value.value.key = params.get('filter-key');
      if (params.get('filter-value')) this.filter.value.value.value = params.get('filter-value');
      if (params.get('last-doc')) this.lastDocId = params.get('last-doc');
    });
  }

  protected updateRouteParams(): void {
    const queryParams: Params = {
      'order-by': this.colSorted.fieldPath,
      'order-direction': this.colSorted.directionStr
    };
    if (this.filter && this.filter.value.value.key && this.filter.value.value.value) {
      queryParams['filter-key'] = this.filter.value.value.key;
      queryParams['filter-value'] = this.filter.value.value.value;
    }
    if (this.lastDocId) {
      queryParams['last-doc'] = this.lastDocId;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge' // conserve les autres paramètres
    });
  }

  public onFirstPage(): void {
    this.isLoading = true;
    this.firestoreService.firstPage(this.colSorted, this.pageSize).then(t => this.defineData(t));
  }

  public onPrevPage(): void {
    this.isLoading = true;
    this.firestoreService.prevPage(this.colSorted, this.pageSize).then(t => this.defineData(t));
  }

  public onNextPage(): void {
    this.isLoading = true;
    this.firestoreService.nextPage(this.colSorted, this.pageSize).then(t => this.defineData(t));
  }

  public onLastPage(): void {
    this.isLoading = true;
    this.firestoreService.lastPage(this.colSorted, this.pageSize).then(t => this.defineData(t));
  }

  public defineData(page: Pageable<T>): void {
    this.tableSet.data = this.toDto ? this.toDto(page.items) : page.items;
    this.hasNext = page.hasNext;
    this.hasPrev = page.hasPrevious;
    this.updateRouteParams();
    this.isLoading = false;
  }

  public onFilterChange(): void {
    this.getByQuery();
  }
}
