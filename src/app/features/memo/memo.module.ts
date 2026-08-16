import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { MemoRoutingModule } from './memo-routing.module';

import { EditionFieldComponent } from './components/edition-field/edition-field.component';
import { EditionTitleComponent } from './components/edition-title/edition-title.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { PageMemoComponent } from './page/page-memo.component';
import { MemoService } from './service/memo.firestore.service';


@NgModule({
  declarations: [
    PageMemoComponent,
    TabContentComponent,
    EditionFieldComponent,
    EditionTitleComponent,
  ],
  imports: [
    CommonModule,
    MemoRoutingModule,
    SharedModule
  ],
  providers: [MemoService]
})
export class MemoModule { }
