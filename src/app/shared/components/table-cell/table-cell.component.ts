import { AfterViewInit, Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { ColumnSet, FieldComponent, FieldSet } from '../../models/tableSet.interface';
import { DestroyService } from '../../services/destroy.service';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellComponent implements AfterViewInit, OnDestroy {
  @Input() columnSet!: ColumnSet;
  @Input() rowData?: any;
  @Input() parentForm?: NgForm;
  @Input() readOnly?: boolean;
  @ViewChild('custom', {read: ViewContainerRef}) target!: ViewContainerRef;
  private childComponent!: ComponentRef<any>;

  constructor(private destroy$: DestroyService, public alert: AlertService) {}

  ngAfterViewInit(): void {
    if (this.columnSet.type === 'custom') this.loadComponent();
  }

  ngOnDestroy(): void {
    if (this.childComponent) {
      this.target.remove();
    }
  }

  private loadComponent(): void {
    console.log('table-cell custom');
    if (this.columnSet.render) {      
      this.childComponent = this.target.createComponent<FieldComponent>(this.columnSet.render.component);
      this.childComponent.instance.data = this.columnSet.render.valuePrepare(this.rowData, this.columnSet);
      this.childComponent.changeDetectorRef.detectChanges();
      this.listenComponent();
    }
  }

  private listenComponent(): void {

    if (this.childComponent.instance.onBlur) {
      this.childComponent.instance.onBlur.pipe(takeUntil(this.destroy$))
        .subscribe(async () => {       
          const fieldSet = this.childComponent.instance.data as FieldSet;
          this.rowData[this.columnSet.key] = fieldSet.value;
          if (this.columnSet.render) {
            const response = await this.columnSet.render.valueSave(this.rowData);
            this.alert.success(`Save ${response ? JSON.stringify(response) : '' }`);
          }
        });
    }

    if (this.childComponent.instance.output) {
      this.childComponent.instance.output
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(async (value: string) => {  
          this.rowData[this.columnSet.key] = value;
          if (this.columnSet.render) {
            await this.columnSet.render.valueSave(this.rowData);
            this.alert.success(`Save Success`);
          }
        });
    }
  }
}
