import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { PriorityComponent } from '@shared/components/priority/priority.component';
import { ColumnSet, RenderFieldSet, TableSet } from '@shared/models/tableSet.interface';
import { Modal } from '@shared/services/modal.service';
import { UtilService } from '@shared/services/util.service';
import { VideoController } from 'app/musique/abstracts/videoController.abstract';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';

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
        type: 'string',
        visible: true,
        width: '15%'
      },
      {
        key: 'addedAt',
        title: "Date d'ajout",
        type: 'date',
        visible: true,
        width: '15%'
      },
      {
        key: 'updatedAt',
        title: "Date de modif",
        type: 'date',
        visible: true,
        width: '15%'
      },
      {
        key: 'extractWiki',
        title: "Wikipedia",
        type: 'html',
        visible: true,
        width: '15%',
        innerHTML: (row: any, col: ColumnSet) => row['extractWiki'] ? `<img width="20px" src='../../../assets/Wiki.svg' />` : ''
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

  private util = inject(UtilService);

  ngOnInit(): void {
    this.loading = true;
    this.getVideos().subscribe(videos => {
      this.tableSet.data = this.util.sortInByDesc(videos, 'addedAt');
      this.loading = false;
    });
  }

}
