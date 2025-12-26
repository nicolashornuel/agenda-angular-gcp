import { Component, inject } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import {
  ActionSet,
  CellRenderers,
  ColumnHtml,
  ColumnSet,
  ColumnString
} from '@shared/models/tableSet.interface';
import { TrackingLocation } from 'app/location/models/locations.constant';
import { LocationService } from 'app/location/services/location.firestore.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends ListController<TrackingLocation> {
  protected override firestoreService = inject(LocationService);

  protected override getColumnSet(): ColumnSet[] {
    return [
      new ColumnString(TrackingLocation.ADDRESS, true),
      new ColumnHtml(TrackingLocation.TIME, true, CellRenderers.toShortDate()),
      new ColumnString(TrackingLocation.USER, true),
      new ColumnString(TrackingLocation.PROVIDER, true)
    ];
  }
  protected override getActionSet(): ActionSet[] {
    return [
      new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer', row))
    ];
  }

  protected override initData(): void {
    this.tableSet.height = 'calc(100vh - 272px)';
    super.initColSorted({ fieldPath: 'time', directionStr: 'desc' });
    super.initPagination();
    this.initPeriod(); 
  }
  
  public override onCreate(): void {
    throw new Error('Method not implemented.');
  }

  public period!: { startAt: Date; endAt: Date };
  public isLocked = true;

  private initPeriod(): void {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    this.period = {
      startAt: date,
      endAt: new Date()
    };
  }

  public onPeriodFilter(): void {
    this.isLoading = true;
    this.firestoreService
      .findByDateRange('time', new Date(this.period.startAt).getTime(), new Date(this.period.endAt).getTime())
      .pipe(take(1))
      .subscribe(items => this.defineData({ items: items, hasNext: false, hasPrevious: false }));
  }

  @IsAdmin()
  public onPeriodDelete(): void {
    this.isLoading = true;
    let promises = this.tableSet.data.map((item: Identifiable) => this.firestoreService.delete(item.id!));
    Promise.all(promises)
      .then(() => {
        this.isLoading = false;
        this.tableSet.data = [];
      })
      .catch(() => {
        this.isLoading = false;
      });
  }
}
