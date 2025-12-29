import { Component, inject } from '@angular/core';
import { IsAdmin } from '@core/decorators/hasRole.decorator';
import { Identifiable } from '@shared/abstracts/abstract-controller.directive';
import { ListController } from '@shared/abstracts/abstract-listController.directive';
import { ActionSet, CellRenderers, ColumnHtml, ColumnSet, ColumnString } from '@shared/models/tableSet.interface';
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
      new ColumnHtml(TrackingLocation.ACCURACY, true, (row: any, col: ColumnSet) => "± " + row[col.key].toFixed(1) + ' m'),
      new ColumnString(TrackingLocation.ADDRESS, true),
      new ColumnHtml(TrackingLocation.ALTITUDE, true, (row: any, col: ColumnSet) => row[col.key].toFixed(1) + ' m'),
      new ColumnHtml(TrackingLocation.BEARING, true, (row: any, col: ColumnSet) => {
        const bearing = row[col.key];
        let direction;
        if (bearing >= 337.5 || bearing < 22.5) direction = 'N';
        else if (bearing < 67.5) direction = 'NE';
        else if (bearing < 112.5) direction = 'E';
        else if (bearing < 157.5) direction = 'SE';
        else if (bearing < 202.5) direction = 'S';
        else if (bearing < 247.5) direction = 'SO';
        else if (bearing < 292.5) direction = 'O';
        else direction = 'NO';
        return direction;
      }),
      new ColumnHtml(TrackingLocation.DATE, true, CellRenderers.toShortDate()),
      new ColumnString(TrackingLocation.PROVIDER, true),
      new ColumnHtml(TrackingLocation.SPEED, true, (row: any, col: ColumnSet) => {
        const speedKmh = row[col.key] * 3.6;
        return speedKmh.toFixed(1) + ' km/h';
      }),
      new ColumnHtml(TrackingLocation.TIME, true, CellRenderers.toShortDate()),
      new ColumnString(TrackingLocation.USER, true)
    ];
  }
  protected override getActionSet(): ActionSet[] {
    return [new ActionSet(ActionSet.DELETE, row => this.onOpenConfirm('Supprimer', row))];
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
