import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbstractInputComponent } from './abstracts/input.component';
import { AbstractNgModelComponent } from './abstracts/ng-model.component';
import { AlertComponent } from './components/alert/alert.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { CardComponent } from './components/card/card.component';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTextareaComponent } from './components/input-textarea/input-textarea.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PopoverComponent } from './components/popover/popover.component';
import { PriorityComponent } from './components/priority/priority.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TableCellHeaderComponent } from './components/table-cell-header/table-cell-header.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableCheckboxComponent } from './components/table-checkbox/table-checkbox.component';
import { TableInputComponent } from './components/table-input/table-input.component';
import { TableComponent } from './components/table/table.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { PopoverDirective } from './directives/popover.directive';
import { TooltipDirective } from './directives/tooltip.directive';
import { BadgeComponent } from './components/badge/badge.component';
import { ButtonDirective } from './directives/button.directive';
import { IconComponent } from './components/icon/icon.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { InputSuggestionComponent } from './components/input-suggestion/input-suggestion.component';
import { InputToggleComponent } from './components/input-toggle/input-toggle.component';
import { InputSliderComponent } from './components/input-slider/input-slider.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { CarouselItemDirective } from './components/carousel/carousel-item.directive';
import { IsMobileDirective } from './directives/is-mobile.directive';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';

const sharedComponents = [
  TableComponent,
  TableCellComponent,
  PriorityComponent,
  SelectComponent,
  SpinnerComponent,
  TableCellHeaderComponent,
  AlertComponent,
  TooltipComponent,
  NavbarComponent,
  PopoverComponent,
  TableInputComponent,
  TableCheckboxComponent,
  LayoutComponent,
  AbstractNgModelComponent,
  AbstractInputComponent,
  CardComponent,
  ButtonGroupComponent,
  InputTextComponent,
  InputCheckboxComponent,
  InputTextareaComponent,
  ModalComponent,
  BadgeComponent,
  IconComponent,
  RightBarComponent,
  InputSuggestionComponent,
  InputToggleComponent,
  InputSliderComponent,
  CarouselComponent,
  TabsComponent,
  CarouselItemDirective,
  InputDateComponent,
  InputNumberComponent
]

const sharedModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule
]

const sharedDirectives = [
  TooltipDirective,
  PopoverDirective,
  ButtonDirective,
  IsMobileDirective
]

@NgModule({
  declarations: [
    sharedComponents,
    sharedDirectives
  ],
  imports: [
    sharedModules
  ],
  exports: [
    sharedComponents,
    sharedModules,
    sharedDirectives
  ]
})
export class SharedModule { }
