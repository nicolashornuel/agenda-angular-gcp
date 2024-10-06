import { Component, Input, OnInit } from '@angular/core';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { RssCard, RssService } from '@core/services/rss.service';
import { ColumnSet, TableSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() url!: string;
  public loading = false;
  public cards: RssCard[] = [];

  public tableSet: TableSet = {
    title: this.url,
    verticaltextHeader: false,
    hover: false,
    height: 'calc(100vh - 240px)',
    columnSet: [
      {
        key: 'pubDate',
        title: 'Date',
        type: 'date',
        visible: true,
        width: '120px'
      },
      {
        key: 'category',
        title: 'categorie',
        type: 'string',
        visible: true
      },
      {
        key: 'img',
        title: 'Image',
        type: 'html',
        visible: true,
        innerHTML: (row: any, col: ColumnSet) => `<img width="100px" src=${row[col.key]}/>`
      },
      {
        key: 'title',
        title: 'Titre',
        type: 'string',
        visible: true
      },
      {
        key: 'description',
        title: 'Description',
        type: 'string',
        visible: true
      }
    ],
    data: []
  };

  constructor(private rss: RssService, private fetchService: AbstractFetchFunctionService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const { data } = await this.fetchService.getText(this.url);
    this.tableSet.data = [...this.rss.createCards(data)];
    //this.tableSet.data = ...this.rss.createCards(data);
    // this.tableSet.data.push(...this.rss.createCards(data));
    this.loading = false;
  }
}
