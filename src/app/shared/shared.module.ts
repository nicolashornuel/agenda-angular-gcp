import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from './directives/tooltip.directive';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { PopoverDirective } from './directives/popover.directive';
import { TableComponent } from './components/table/table.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';

@NgModule({
  declarations: [
    TooltipDirective,
    TooltipComponent,
    PopoverDirective,
    TableComponent,
    TableCellComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    TooltipDirective,
    TableComponent,
    TableCellComponent
  ]
})
export class SharedModule { }
