import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  exports: [

  ]
})
export class CoreModule { }

/* 🚀 Bonnes pratiques
✅ Importer CoreModule uniquement dans AppModule
✅ Utiliser @SkipSelf() pour éviter plusieurs instances
✅ Ne pas y mettre de composants ou de directives (ceux-ci vont dans SharedModule)
✅ S'assurer que tous les services sont en providedIn: 'root' ou déclarés dans providers 
🔹 En résumé :
CoreModule sert à regrouper tout ce qui doit être global et singleton (services, guards, intercepteurs). 
Cela améliore la modularité et la maintenance de l’application. 🎯*/
