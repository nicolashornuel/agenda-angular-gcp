import { Component, Input, OnInit } from '@angular/core';
import { ColumnSet, TableSet } from '@shared/models/tableSet.interface';
import { ColSorted } from '@shared/services/columnsortable.service';
import { DestroyService } from '@shared/services/destroy.service';
import { Utils } from '@shared/utils/utils';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-cell-header',
  templateUrl: './table-cell-header.component.html',
  styleUrls: ['./table-cell-header.component.scss']
})
export class TableCellHeaderComponent implements OnInit {
  @Input() tableSet!: TableSet;
  @Input() columnSet!: ColumnSet;
  public colSorted?: ColSorted;
  public sortClass!: string;

  constructor(private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.tableSet.sortable?.getColumnSort$.pipe(takeUntil(this.destroy$)).subscribe((colSorted: ColSorted | undefined) => {
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
    this.tableSet.data = Utils.sortByDesc(this.tableSet.data, this.columnSet.key);
    this.tableSet.sortable?.setColumnSort$({fieldPath: this.columnSet.key, directionStr: 'asc'});
    this.sortClass = 'fas fa-sort-down';
  }

  public sortInByAsc(): void {
    this.tableSet.data = Utils.sortByAsc(this.tableSet.data, this.columnSet.key);
    this.tableSet.sortable?.setColumnSort$({fieldPath: this.columnSet.key, directionStr: 'desc'});
    this.sortClass = 'fas fa-sort-up';
  }
}
