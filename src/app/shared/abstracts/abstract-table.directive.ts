import { Directive, inject, OnInit } from '@angular/core';
import { TableSet } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { Observable, takeUntil } from 'rxjs';
import { AbstractModal } from './abstract-modal.directive';

@Directive({
  selector: '[]'
})
export abstract class AbstractTable<T> extends AbstractModal<T> implements OnInit {
  public isLoading!: boolean;
  public tableSet!: TableSet;
  public destroy$ = inject(DestroyService);
  
  protected abstract get data$(): Observable<T[]>;
  protected abstract initComponent(): void;

  ngOnInit(): void {
    this.initComponent();
    this.isLoading = true;
    this.data$.pipe(takeUntil(this.destroy$)).subscribe((t: T[]) => {
      this.tableSet.data = t;
      this.isLoading = false;
    });
  }
}
