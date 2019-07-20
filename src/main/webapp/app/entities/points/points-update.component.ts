import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IPoints, Points } from 'app/shared/model/points.model';
import { PointsService } from './points.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-points-update',
  templateUrl: './points-update.component.html'
})
export class PointsUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];
  dateDp: any;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    exercise: [],
    meals: [],
    alcohol: [],
    notes: [null, [Validators.maxLength(140)]],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected pointsService: PointsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ points }) => {
      this.updateForm(points);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(points: IPoints) {
    this.editForm.patchValue({
      id: points.id,
      date: points.date,
      exercise: points.exercise,
      meals: points.meals,
      alcohol: points.alcohol,
      notes: points.notes,
      user: points.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const points = this.createFromForm();
    if (points.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsService.update(points));
    } else {
      this.subscribeToSaveResponse(this.pointsService.create(points));
    }
  }

  private createFromForm(): IPoints {
    return {
      ...new Points(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value,
      exercise: this.editForm.get(['exercise']).value,
      meals: this.editForm.get(['meals']).value,
      alcohol: this.editForm.get(['alcohol']).value,
      notes: this.editForm.get(['notes']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoints>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
