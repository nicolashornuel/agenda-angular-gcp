import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AgendaModule } from '@agenda/agenda.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { CoreModule } from '@core/core.module';
import { HomeModule } from './home/home.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule,
    AgendaModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();

      // https://firebase.google.com/docs/firestore/manage-data/enable-offline?hl=fr
      
      // This is the default behavior if no persistence is specified.
      // initializeFirestore(firestore.app, {localCache: memoryLocalCache()});

      // Defaults to single-tab persistence if no tab manager is specified.
      //initializeFirestore(firestore.app, {localCache: persistentLocalCache(/*settings*/{})});

      return firestore;

    })
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
  }
}
