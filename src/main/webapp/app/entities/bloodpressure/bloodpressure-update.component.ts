import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
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

  editForm = this.fb.group({
    id: [],
    systolic: [],
    diastolic: [],
    timestamp: [null, [Validators.required]],
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
      systolic: bloodpressure.systolic,
      diastolic: bloodpressure.diastolic,
      timestamp: bloodpressure.timestamp != null ? bloodpressure.timestamp.format(DATE_TIME_FORMAT) : null,
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
      systolic: this.editForm.get(['systolic']).value,
      diastolic: this.editForm.get(['diastolic']).value,
      timestamp:
        this.editForm.get(['timestamp']).value != null ? moment(this.editForm.get(['timestamp']).value, DATE_TIME_FORMAT) : undefined,
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
