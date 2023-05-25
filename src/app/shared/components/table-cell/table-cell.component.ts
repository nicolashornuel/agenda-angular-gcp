import { AfterViewInit, Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { AlertService } from '../../../core/services/alert.service';
import { ColumnSet, FieldComponent } from '../../models/tableSet.interface';
import { DestroyService } from '../../services/destroy.service';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellComponent implements AfterViewInit, OnDestroy {
  @Input() columnSet!: ColumnSet;
  @Input() isHeader?: boolean;
  @Input() rowData?: any;
  @Input() parentForm?: NgForm;
  @Input() readOnly?: boolean;
  @ViewChild('custom', {read: ViewContainerRef}) target!: ViewContainerRef;
  private childComponent!: ComponentRef<any>;

  constructor(private destroy$: DestroyService, public alert: AlertService) {}

  ngAfterViewInit(): void {
    if (!this.isHeader && this.columnSet.type === 'custom') this.loadComponent();
  }

  ngOnDestroy(): void {
    if (this.childComponent) {
      this.target.remove();
    }
  }

  private loadComponent(): void {
    console.log('table-cell custom');
    if (this.columnSet.renderComponent) {      
      this.childComponent = this.target.createComponent<FieldComponent>(this.columnSet.renderComponent);
      this.childComponent.instance.data = {
        name: this.columnSet.key,
        value: this.rowData[this.columnSet.key],
        disabled: false
      };      
      this.childComponent.changeDetectorRef.detectChanges();
      this.listenComponent();
    }
  }

  private listenComponent(): void {
    if (this.parentForm && this.childComponent.instance.input) {
      this.childComponent.instance.input.statusChanges
        .pipe(
          switchMap(() => this.childComponent.instance.input.valueChanges),
          debounceTime(1000),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(async (value: string) => {
          this.rowData[this.columnSet.key] = value;
          if (this.columnSet.valueSave) {
            this.childComponent.instance.isUpdating = true;
            await this.columnSet.valueSave(this.rowData);
            this.childComponent.instance.isUpdating = false;
            this.alert.success(`Save Success`);
          }
        });
    }
  }
}
