import { Component } from '@angular/core';
import { AbstractTable } from '@shared/abstracts/abstract-table.directive';
import { ActionSet, CellRenderers, ColumnCustom, TableSet } from '@shared/models/tableSet.interface';
import { RssFeed } from 'app/actualite/models/rss-feed.model';
import { RssFeedService } from 'app/actualite/services/rss-feed.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-feed',
  templateUrl: './list-feed.component.html',
  styleUrls: ['./list-feed.component.scss']
})
export class ListFeedComponent extends AbstractTable<RssFeed> {

  constructor(private feedService: RssFeedService) {
    super();
  }

  protected override get data$(): Observable<RssFeed[]> {
    return this.feedService.getAll();
  }

  protected override initComponent(): void {
    this.tableSet = new TableSet('auto');
    this.tableSet.columnSet = [
      new ColumnCustom(RssFeed.NAME_KEY, true, CellRenderers.toInputText()),
      new ColumnCustom(RssFeed.URL_KEY, true, CellRenderers.toInputText()).setWidth('50%'),
      new ColumnCustom(RssFeed.SLUG_KEY, true, CellRenderers.toInputText()),
      new ColumnCustom(RssFeed.ORDER_KEY, true, CellRenderers.toInputText()).setWidth('5%'),
    ];
    this.tableSet.actionSet = [
      new ActionSet(ActionSet.DELETE, (row, index) => this.delete(row, index!))
    ];
  }

  public onAdd() {
    this.tableSet.data.push(new RssFeed(this.tableSet.data.length + 1));    
  }

  public override onSave() {
    let promises = this.tableSet.data.map( feed => this.feedService.saveOrUpdate(feed));
    Promise.all(promises).then(() => super.onSave());
  }

  private delete(rssFeed: RssFeed, index: number) {
    this.tableSet.data.splice(index, 1);
    if (rssFeed.id) this.feedService.delete(rssFeed.id!);
  }
}
