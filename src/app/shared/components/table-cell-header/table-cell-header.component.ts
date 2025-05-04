import { Component, Input, OnInit } from '@angular/core';
import { ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { ColSorted, ColumnsortableService } from '@shared/services/columnsortable.service';
import { DestroyService } from '@shared/services/destroy.service';
import { UtilService } from '@shared/services/util.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-cell-header',
  templateUrl: './table-cell-header.component.html',
  styleUrls: ['./table-cell-header.component.scss']
})
export class TableCellHeaderComponent implements OnInit {
  @Input() tableSet!: TableSet;
  @Input() columnSet!: ColumnSet;
  @Input() isEditing!: boolean;
  public colSorted?: ColSorted;
  public sortClass!: string;

  constructor(
    private util: UtilService,
    private colSortable: ColumnsortableService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.colSortable.getColumnSort$.pipe(takeUntil(this.destroy$)).subscribe((colSorted: ColSorted | undefined) => {
      if (colSorted) {
        this.colSorted = colSorted;
        if (colSorted.fieldPath != this.columnSet.key) {
          this.sortClass = 'fas fa-sort hidden';
        } else {
          this.sortClass = colSorted.directionStr == 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }
      }
    });
  }

  public sort() {
    if (!this.colSorted || this.colSorted.fieldPath != this.columnSet.key || this.colSorted?.directionStr == 'desc') {
      this.sortInByDesc();
    } else {
      this.sortInByAsc();
    }
  }

  public sortInByDesc(): void {
    this.tableSet.data = this.util.sortInByDesc(this.tableSet.data, this.columnSet.key);
    this.colSortable.setColumnSort$({fieldPath: this.columnSet.key, directionStr: 'asc'});
    this.sortClass = 'fas fa-sort-down';
  }

  public sortInByAsc(): void {
    this.tableSet.data = this.util.sortInByAsc(this.tableSet.data, this.columnSet.key);
    this.colSortable.setColumnSort$({fieldPath: this.columnSet.key, directionStr: 'desc'});
    this.sortClass = 'fas fa-sort-up';
  }
}
