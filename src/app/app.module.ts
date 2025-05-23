import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { RadioModule } from 'app/radio/radio.module';
import { environment } from '../environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { GlobalInjector } from '@core/decorators/global-injector';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RadioModule,
    SharedModule,
    CoreModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const firestore = getFirestore();

      // https://firebase.google.com/docs/firestore/manage-data/enable-offline?hl=fr

      // This is the default behavior if no persistence is specified.
      // initializeFirestore(firestore.app, {localCache: memoryLocalCache()});

      // Defaults to single-tab persistence if no tab manager is specified.
      //initializeFirestore(firestore.app, {localCache: persistentLocalCache(/*settings*/{})});

      return firestore;
    }),

    provideStorage(() => {
      const firebaseStorage = getStorage();
      if (location.hostname === 'localhost') {
        connectStorageEmulator(firebaseStorage, '127.0.0.1', 5001);
      }
      return firebaseStorage;
    })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    registerLocaleData(localeFr);
    GlobalInjector.injector = injector;
  }
}
