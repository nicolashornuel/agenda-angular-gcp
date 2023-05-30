import {AfterViewInit, Component, Input} from '@angular/core';
import {ColumnSet, TableSet} from '@shared/models/tableSet.interface';
import {ColSorted, ColumnsortableService} from '@shared/services/columnsortable.service';
import {DestroyService} from '@shared/services/destroy.service';
import {UtilService} from '@shared/services/util.service';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-table-cell-header',
  templateUrl: './table-cell-header.component.html',
  styleUrls: ['./table-cell-header.component.scss']
})
export class TableCellHeaderComponent implements AfterViewInit {
  @Input() tableSet!: TableSet;
  @Input() columnSet!: ColumnSet;
  public colSorted?: ColSorted;
  public sortClass = 'fas fa-sort hidden';

  constructor(
    private util: UtilService,
    private colSortable: ColumnsortableService,
    private destroy$: DestroyService
  ) {}

  ngAfterViewInit(): void {
    this.colSortable.getColumnSort$.pipe(takeUntil(this.destroy$)).subscribe((colSorted: ColSorted | undefined) => {
      if (colSorted) {
        this.colSorted = colSorted;
        if (colSorted.colKey != this.columnSet.key) {
          this.sortClass = 'fas fa-sort hidden';
        }
      }
    });
  }

  public sort() {
    if (!this.colSorted || this.colSorted.colKey != this.columnSet.key || this.colSorted?.direction == 'up') {
      this.sortInByDesc();
    } else {
      this.sortInByAsc();
    }
  }

  public sortInByDesc(): void {
    this.tableSet.data = this.util.sortInByDesc(this.tableSet.data, this.columnSet.key);
    this.colSortable.setColumnSort$({colKey: this.columnSet.key, direction: 'down'});
    this.sortClass = 'fas fa-sort-down';
  }

  public sortInByAsc(): void {
    this.tableSet.data = this.util.sortInByAsc(this.tableSet.data, this.columnSet.key);
    this.colSortable.setColumnSort$({colKey: this.columnSet.key, direction: 'up'});
    this.sortClass = 'fas fa-sort-up';
  }
}
