import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Pageable } from '@core/abstracts/firestore.abstract';
import { VideoGAPI } from '@features/musique/models/musique.interface';
import { DataSelect, Selectable } from '@shared/models/fieldSet.model';
import { Modal } from '@shared/models/modalParam.interface';
import { CellRenderers, ColumnCustom, ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { ColSorted, ColumnsortableService } from '@shared/services/columnsortable.service';
import { VideoController } from 'app/features/musique/abstracts/videoController.abstract';
import { map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-list-saved',
  templateUrl: './list-saved.component.html',
  styleUrls: ['./list-saved.component.scss']
})
export class ListSavedComponent extends VideoController implements OnInit {
  @ViewChild('modal') modal!: TemplateRef<Modal>;
  public loading: boolean = false;

  public tableSet: TableSet = {
    title: 'Ma playlist',
    verticaltextHeader: false,
    hover: true,
    height: 'calc(100vh - 300px)',
    openDetailByClickRow: (row: VideoGAPI) => this.openModal(row, this.modal),
    columnSet: [
      {
        key: 'categorie',
        title: 'Catégorie',
        type: 'string',
        visible: true,
        width: '20%'
      },
      {
        key: 'title',
        title: 'Titre',
        type: 'string',
        visible: true
      },
      {
        key: 'channelTitle',
        title: 'Chaine Youtube',
        type: 'string',
        visible: true,
        width: '20%'
      },
      {
        key: 'publishedAt',
        title: 'Date de publication',
        type: 'date',
        visible: false,
        width: '10%'
      },
      {
        key: 'addedAt',
        title: "Date d'ajout",
        type: 'date',
        visible: false,
        width: '10%'
      },
      {
        key: 'extractWiki',
        title: 'Wikipedia',
        type: 'html',
        visible: false,
        width: '10%',
        innerHTML: (row: any, col: ColumnSet) =>
          row['extractWiki'] ? `<img width="20px" src='../../../assets/Wiki.svg' />` : ''
      },
      {
        key: 'rating',
        title: 'Classement',
        type: 'custom',
        visible: true,
        width: '10%',
        render: CellRenderers.toPriority()
      },
      new ColumnCustom({ name:'Actions' }, true, CellRenderers.toDrag()).setWidth('10%'),
    ],
    data: [],
    sortable: new ColumnsortableService
  };

  public categoryFilter!: DataSelect<string>;
  public readonly pageSize = 20;
  private colSorted: ColSorted = { fieldPath: 'addedAt', directionStr: 'desc' };
  public hasNext!: boolean;
  public hasPrev!: boolean;

  ngOnInit(): void {
    this.tableSet.sortable?.setColumnSort$(this.colSorted);
    this.onFirstPage();
    this.tableSet.sortable?.getColumnSort$.pipe(takeUntil(this.destroy$)).subscribe((colSorted: ColSorted | undefined) => {
      colSorted ? (this.colSorted = colSorted) : undefined;
      this.getByQuery();
    });

    this.getAllCategories();
  }

  public onFirstPage(): void {
    this.loading = true;
    this.videoService.firstPage(this.colSorted, this.pageSize).then(videos => this.defineData(videos));
  }

  public onPrevPage(): void {
    this.loading = true;
    this.videoService.prevPage(this.colSorted, this.pageSize).then(videos => this.defineData(videos));
  }

  public onNextPage(): void {
    this.loading = true;
    this.videoService.nextPage(this.colSorted, this.pageSize).then(videos => this.defineData(videos));
  }

  public onLastPage(): void {
    this.loading = true;
    this.videoService.lastPage(this.colSorted, this.pageSize).then(videos => this.defineData(videos));
  }

  private defineData(page: Pageable<VideoGAPI>): void {
    this.tableSet.data = page.items;
    this.hasNext = page.hasNext;
    this.hasPrev = page.hasPrevious;
    this.loading = false;
  }

  private getAllCategories(): void {
    this.getCategories()
      .pipe(
        map(categories => [...categories].map(categorie => new Selectable(categorie, categorie))),
        tap(options => options.unshift(new Selectable('Toutes catégories', 'Toutes catégories')))
      )
      .subscribe(options => {
        this.categoryFilter = new DataSelect({ key: 'categorie', name: 'Filtrer par catégories' }, options);
        this.categoryFilter.value = this.categoryFilter.options[0];
      });
  }

  public onCategoryFilterChange(): void {
    this.getByQuery();
  }

  private getByQuery(): void {
    this.loading = true;
   this.categoryFilter === undefined || this.categoryFilter?.value.value === 'Toutes catégories' ? this.onFirstPage() : this.videoService
      .getByQuery(this.colSorted, { key: this.categoryFilter.key!, value: this.categoryFilter.value.value })
      .subscribe(videos => this.defineData({items: videos, hasNext: false, hasPrevious: false}));
  }
}
