import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TwentyOnePointsSharedModule } from 'app/shared';
import {
  BloodpressureComponent,
  BloodpressureDetailComponent,
  BloodpressureUpdateComponent,
  BloodpressureDeletePopupComponent,
  BloodpressureDeleteDialogComponent,
  bloodpressureRoute,
  bloodpressurePopupRoute
} from './';

const ENTITY_STATES = [...bloodpressureRoute, ...bloodpressurePopupRoute];

@NgModule({
  imports: [TwentyOnePointsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    BloodpressureComponent,
    BloodpressureDetailComponent,
    BloodpressureUpdateComponent,
    BloodpressureDeleteDialogComponent,
    BloodpressureDeletePopupComponent
  ],
  entryComponents: [
    BloodpressureComponent,
    BloodpressureUpdateComponent,
    BloodpressureDeleteDialogComponent,
    BloodpressureDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsBloodpressureModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
