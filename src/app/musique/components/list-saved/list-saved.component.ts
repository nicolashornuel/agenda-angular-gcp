import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Pageable } from '@core/services/firestore.service';
import { DataSelect, Selectable } from '@shared/models/fieldSet.model';
import { Modal } from '@shared/models/modalParam.interface';
import { CellRenderers, ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { ColSorted, ColumnsortableService } from '@shared/services/columnsortable.service';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
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
    height: 'calc(100vh - 330px)',
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
        visible: true,
        width: '40%'
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
        width: '20%'
      },
      {
        key: 'addedAt',
        title: "Date d'ajout",
        type: 'date',
        visible: true,
        width: '20%'
      },
      {
        key: 'extractWiki',
        title: 'Wikipedia',
        type: 'html',
        visible: true,
        width: '10%',
        innerHTML: (row: any, col: ColumnSet) =>
          row['extractWiki'] ? `<img width="20px" src='../../../assets/Wiki.svg' />` : ''
      },
      {
        key: 'rating',
        title: 'Classement',
        type: 'custom',
        visible: true,
        render: CellRenderers.toPriority()
      }
    ],
    data: []
  };

  public categoryFilter!: DataSelect<string>;
  public readonly pageSize = 20;
  private colSortable: ColumnsortableService = inject(ColumnsortableService);
  private colSorted: ColSorted = { fieldPath: 'addedAt', directionStr: 'desc' };
  public hasNext!: boolean;
  public hasPrev!: boolean;

  ngOnInit(): void {
    this.colSortable.setColumnSort$(this.colSorted);
    this.onFirstPage();
    this.colSortable.getColumnSort$.pipe(takeUntil(this.destroy$)).subscribe((colSorted: ColSorted | undefined) => {
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
