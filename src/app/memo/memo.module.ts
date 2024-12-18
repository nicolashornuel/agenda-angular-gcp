import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemoRoutingModule } from './memo-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ToDoComponent } from './components/to-do/to-do.component';
import { PageMemoComponent } from './page/page-memo.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { EditionSectionComponent } from './components/edition-section/edition-section.component';
import { EditionFieldComponent } from './components/edition-field/edition-field.component';


@NgModule({
  declarations: [
    ToDoComponent,
    PageMemoComponent,
    TabContentComponent,
    EditionSectionComponent,
    EditionFieldComponent,
  ],
  imports: [
    CommonModule,
    MemoRoutingModule,
    SharedModule
  ]
})
export class MemoModule { }
