import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { PriorityComponent } from '@shared/components/priority/priority.component';
import { ColumnSet, FieldSet, RenderFieldSet, TableSet } from '@shared/models/tableSet.interface';
import { ColSorted, ColumnsortableService } from '@shared/services/columnsortable.service';
import { Modal } from '@shared/services/modal.service';
import { Pageable } from 'app/core/services/firestore.service';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { takeUntil } from 'rxjs';

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
        render: {
          component: PriorityComponent,
          valuePrepare: (row: VideoGAPI, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col)
        }
      }
    ],
    data: []
  };

  public popover = {
    title: 'colonne visible',
    fieldSets: this.tableSet.columnSet.map((col: ColumnSet) => {
      return {
        name: col.title,
        value: col.visible,
        disabled: false,
        required: false
      };
    })
  };

  private dataSource!: VideoGAPI[];
  public readonly pageSize = 20;
  private colSortable: ColumnsortableService = inject(ColumnsortableService);
  private colSorted: ColSorted = { colKey: 'addedAt', direction: 'up' };
  public hasNext!: boolean;
  public hasPrev!: boolean;

  ngOnInit(): void {
    this.onFirstPage();
    this.colSortable.getColumnSort$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (colSorted: ColSorted | undefined) => (colSorted ? this.colSorted = colSorted : undefined)
      );
  }

  public onFirstPage(): void {
    this.loading = true;
    this.videoService.firstPage(this.colSorted!.colKey, this.pageSize).then(videos => this.defineData(videos));
  }

  public onPrevPage(): void {
    this.loading = true;
    this.videoService.prevPage(this.colSorted!.colKey, this.pageSize).then(videos => this.defineData(videos));
  }

  public onNextPage(): void {
    this.loading = true;
   this.videoService.nextPage(this.colSorted!.colKey, this.pageSize).then(videos => this.defineData(videos));
  }

  public onLastPage(): void {
    this.loading = true;
   this.videoService.lastPage(this.colSorted!.colKey, this.pageSize).then(videos => this.defineData(videos));
  }

  private defineData(page: Pageable<VideoGAPI>): void {
    this.dataSource = page.items;
    this.tableSet.data = page.items;
    this.hasNext = page.hasNext;
    this.hasPrev = page.hasPrevious;
    this.loading = false;
  }

  public onShowColumn(value: boolean, fieldSet: FieldSet) {
    this.tableSet.columnSet.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible = value;
  }

  public applyFilter(keyword: string): void {
    keyword != ''
      ? (this.tableSet.data = [...this.dataSource.filter((data: VideoGAPI) => data.title.includes(keyword))])
      : (this.tableSet.data = [...this.dataSource]);
  }
}
