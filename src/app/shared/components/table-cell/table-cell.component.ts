import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ColumnSet } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() columnSet!: ColumnSet;
  @Input() rowData?: any;
  @Input() readonly?: boolean;
  @Input() parentForm?: NgForm;
  @ViewChild('custom', { read: ViewContainerRef }) target!: ViewContainerRef;
  private childComponent!: ComponentRef<any>;

  constructor(public alert: AlertService, private destroy$: DestroyService) {}

  ngAfterViewInit(): void {
    if (this.columnSet.type === 'custom') this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['readonly'] && this.childComponent) {
      this.childComponent.instance.readonly = changes['readonly'].currentValue;
    }
  }

  ngOnDestroy(): void {
    if (this.childComponent) {
      this.target.remove();
    }
  }

  private loadComponent(): void {
    if (this.columnSet.render) {
      this.childComponent = this.target.createComponent<any>(this.columnSet.render.component);
      this.columnSet.render.bind(this.rowData, this.columnSet.key, this.childComponent);
      if (this.columnSet.render.listener) {
        this.columnSet.render
          .listener(this.childComponent)
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => (this.rowData[this.columnSet.key] = value));
      }
      this.childComponent.changeDetectorRef.detectChanges();
    }
  }

/*   private getNestedValue(obj: any, path: any) {
    return path.split('.').reduce((acc: any, part: any) => acc?.[part], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((acc, key) => (acc[key] = acc[key] ?? {}), obj);
    target[lastKey] = value;
  } */
}
