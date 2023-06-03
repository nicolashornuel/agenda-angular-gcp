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
import { AlertComponent } from './components/alert/alert.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './components/modal/modal.component';
import { ModalDirective } from './directives/modal.directive';
import { PopoverComponent } from './components/popover/popover.component';

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
  TableCellHeaderComponent,
  AlertComponent,
  TooltipComponent,
  NavbarComponent,
  PopoverComponent
]

const sharedModules = [
  ReactiveFormsModule,
  FormsModule,
  RouterModule
]

const sharedDirectives = [
  TooltipDirective,
  PopoverDirective
]

@NgModule({
  declarations: [
    sharedComponents,
    sharedDirectives,
    ModalComponent,
    ModalDirective
  ],
  imports: [
    CommonModule,
    sharedModules
  ],
  exports: [
    sharedComponents,
    sharedModules,
    sharedDirectives
  ]
})
export class SharedModule { }
