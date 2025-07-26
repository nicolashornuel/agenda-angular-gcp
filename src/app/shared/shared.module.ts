import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbstractInputComponent } from './abstracts/input.component';
import { AbstractNgModelComponent } from './abstracts/ng-model.component';
import { AlertComponent } from './components/alert/alert.component';
import { BadgeComponent } from './components/badge/badge.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { CardComponent } from './components/card/card.component';
import { CarouselItemDirective } from './components/carousel/carousel-item.directive';
import { CarouselComponent } from './components/carousel/carousel.component';
import { IconComponent } from './components/icon/icon.component';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputSliderComponent } from './components/input-slider/input-slider.component';
import { InputSuggestionComponent } from './components/input-suggestion/input-suggestion.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTextareaComponent } from './components/input-textarea/input-textarea.component';
import { InputToggleComponent } from './components/input-toggle/input-toggle.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PopoverComponent } from './components/popover/popover.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TableCellHeaderComponent } from './components/table-cell-header/table-cell-header.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { TableComponent } from './components/table/table.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { ButtonDirective } from './directives/button.directive';
import { IsMobileDirective } from './directives/is-mobile.directive';
import { PopoverDirective } from './directives/popover.directive';
import { TooltipDirective } from './directives/tooltip.directive';
import { BadgeLinkComponent } from './components/badge-link/badge-link.component';
import { InputFileComponent } from './components/input-file/input-file.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { NumberSuffixPipe } from './pipes/number-suffix.pipe';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { InputStarComponent } from './components/input-star/input-star.component';
import { DraggableDirective } from './directives/draggable.directive';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { InputTimeComponent } from './components/input-time/input-time.component';
import { TitleComponent } from './components/title/title.component';
import { InputMonthComponent } from './components/input-month/input-month.component';

const sharedComponents = [
  TableComponent,
  TableCellComponent,
  SpinnerComponent,
  TableCellHeaderComponent,
  AlertComponent,
  TooltipComponent,
  NavbarComponent,
  PopoverComponent,
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
  InputNumberComponent,
  BadgeLinkComponent,
  InputFileComponent,
  AccordionComponent,
  InputSelectComponent,
  InputStarComponent,
  ReadMoreComponent,
  InputTimeComponent,
  InputMonthComponent,
  TitleComponent
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
  IsMobileDirective,
  NumberSuffixPipe,
  DraggableDirective
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
