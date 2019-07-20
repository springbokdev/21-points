import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Bloodpressure } from 'app/shared/model/bloodpressure.model';
import { BloodpressureService } from './bloodpressure.service';
import { BloodpressureComponent } from './bloodpressure.component';
import { BloodpressureDetailComponent } from './bloodpressure-detail.component';
import { BloodpressureUpdateComponent } from './bloodpressure-update.component';
import { BloodpressureDeletePopupComponent } from './bloodpressure-delete-dialog.component';
import { IBloodpressure } from 'app/shared/model/bloodpressure.model';

@Injectable({ providedIn: 'root' })
export class BloodpressureResolve implements Resolve<IBloodpressure> {
  constructor(private service: BloodpressureService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBloodpressure> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Bloodpressure>) => response.ok),
        map((bloodpressure: HttpResponse<Bloodpressure>) => bloodpressure.body)
      );
    }
    return of(new Bloodpressure());
  }
}

export const bloodpressureRoute: Routes = [
  {
    path: '',
    component: BloodpressureComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'twentyOnePointsApp.bloodpressure.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: BloodpressureDetailComponent,
    resolve: {
      bloodpressure: BloodpressureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'twentyOnePointsApp.bloodpressure.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: BloodpressureUpdateComponent,
    resolve: {
      bloodpressure: BloodpressureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'twentyOnePointsApp.bloodpressure.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: BloodpressureUpdateComponent,
    resolve: {
      bloodpressure: BloodpressureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'twentyOnePointsApp.bloodpressure.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const bloodpressurePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: BloodpressureDeletePopupComponent,
    resolve: {
      bloodpressure: BloodpressureResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'twentyOnePointsApp.bloodpressure.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
