import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { MemoRoutingModule } from './memo-routing.module';

import { EditionFieldComponent } from './components/edition-field/edition-field.component';
import { EditionTitleComponent } from './components/edition-title/edition-title.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { ToDoComponent } from './components/to-do/to-do.component';
import { PageMemoComponent } from './page/page-memo.component';


@NgModule({
  declarations: [
    ToDoComponent,
    PageMemoComponent,
    TabContentComponent,
    EditionFieldComponent,
    EditionTitleComponent,
  ],
  imports: [
    CommonModule,
    MemoRoutingModule,
    SharedModule
  ]
})
export class MemoModule { }
