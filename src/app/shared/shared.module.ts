import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { InputCheckboxComponent, InputComponent, InputTextComponent } from './components/input/input.component';
import { PriorityComponent } from './components/priority/priority.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TableCellHeaderComponent } from './components/table-cell-header/table-cell-header.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableComponent } from './components/table/table.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { PopoverDirective } from './directives/popover.directive';
import { TooltipDirective } from './directives/tooltip.directive';

const sharedComponents = [
  TableComponent,
  TableCellComponent,
  InputComponent,
  InputTextComponent,
  InputCheckboxComponent,
  PriorityComponent,
  SelectComponent,
  TextareaComponent,
  ButtonComponent,
  SpinnerComponent,
  TableCellHeaderComponent
]

@NgModule({
  declarations: [
    TooltipDirective,
    TooltipComponent,
    PopoverDirective,
    sharedComponents,
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
    sharedComponents
  ]
})
export class SharedModule { }
