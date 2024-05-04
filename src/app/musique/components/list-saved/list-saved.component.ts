import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PriorityComponent } from '@shared/components/priority/priority.component';
import { Modal } from '@shared/models/modalParam.interface';
import { ColumnSet, RenderFieldSet, TableSet } from '@shared/models/tableSet.interface';
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
    title: 'À faire',
    verticaltextHeader: false,
    hover: true,
    height: 'calc(100vh - 450px)',
    openDetailByClickRow: (row: VideoGAPI) => this.openModal(row, this.modal),
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

  ngOnInit(): void {
    this.loading = true;
    this.getVideos().subscribe(videos => {
      this.tableSet.data = videos;
      this.loading = false;
    });
  }

}
