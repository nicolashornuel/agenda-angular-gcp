import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PriorityComponent } from '@shared/components/priority/priority.component';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ColumnSet, RenderFieldSet, TableSet } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { ModalService } from '@shared/services/modal.service';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { VideoService } from 'app/musique/services/video.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-saved',
  templateUrl: './list-saved.component.html',
  styleUrls: ['./list-saved.component.scss']
})
export class ListSavedComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('modal') modal!: TemplateRef<Modal>;

  public tableSet: TableSet = {
    title: 'À faire',
    verticaltextHeader: false,
    hover: true,
    height: 'calc(100vh - 450px)',
    openDetailByClickRow: (row: any) => this.openDetail(row),
    columnSet: [
      {
        key: 'categorie',
        title: 'Catégorie',
        type: 'string',
        visible: true
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
        width: '40%'
      },
      {
        key: 'publishedAt',
        title: 'Date de publication',
        type: 'string',
        visible: true,
        width: '40%'
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

  constructor(private videoService: VideoService, private destroy$: DestroyService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.loading = true;
    this.videoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: any) => {
        this.tableSet.data = items;
        this.tableSet.title = `(${items.length}) Vidéos - Toute catégorie confondue`;
        this.loading = false;
      });
  }

  public openDetail(item: VideoGAPI): void {
    const modalParam: ModalParam = {
      context: {$implicit: item},
      template: this.modal
    }
    this.modalService.set$(modalParam)
  }
}
