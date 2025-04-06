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
import { AlertService } from '../../services/alert.service';
import { ColumnSet } from '@shared/models/tableSet.interface';
import { FieldComponent, FieldSet } from '@shared/models/fieldSet.model';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs';

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
  private childComponent!: ComponentRef<FieldComponent>;

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
      this.childComponent = this.target.createComponent<FieldComponent>(this.columnSet.render.component);
      this.childComponent.instance.data = this.columnSet.render.valuePrepare(this.rowData, this.columnSet);
      if (this.childComponent.instance.dataChange)
        this.childComponent.instance.dataChange.pipe(takeUntil(this.destroy$)).subscribe(
          (fieldSet: FieldSet) => (this.rowData[this.childComponent.instance.data.name] = fieldSet)
        );
      this.childComponent.instance.readonly = this.readonly;
      this.childComponent.instance.parentForm = this.parentForm;
      this.childComponent.changeDetectorRef.detectChanges();
    }
  }
}
