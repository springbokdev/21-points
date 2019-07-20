import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IBloodpressure, Bloodpressure } from 'app/shared/model/bloodpressure.model';
import { BloodpressureService } from './bloodpressure.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-bloodpressure-update',
  templateUrl: './bloodpressure-update.component.html'
})
export class BloodpressureUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];
  timestampDp: any;

  editForm = this.fb.group({
    id: [],
    timestamp: [],
    systolic: [],
    diastolic: [],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected bloodpressureService: BloodpressureService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ bloodpressure }) => {
      this.updateForm(bloodpressure);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(bloodpressure: IBloodpressure) {
    this.editForm.patchValue({
      id: bloodpressure.id,
      timestamp: bloodpressure.timestamp,
      systolic: bloodpressure.systolic,
      diastolic: bloodpressure.diastolic,
      user: bloodpressure.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const bloodpressure = this.createFromForm();
    if (bloodpressure.id !== undefined) {
      this.subscribeToSaveResponse(this.bloodpressureService.update(bloodpressure));
    } else {
      this.subscribeToSaveResponse(this.bloodpressureService.create(bloodpressure));
    }
  }

  private createFromForm(): IBloodpressure {
    return {
      ...new Bloodpressure(),
      id: this.editForm.get(['id']).value,
      timestamp: this.editForm.get(['timestamp']).value,
      systolic: this.editForm.get(['systolic']).value,
      diastolic: this.editForm.get(['diastolic']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBloodpressure>>) {
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
