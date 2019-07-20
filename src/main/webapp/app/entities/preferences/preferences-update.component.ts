import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPreferences, Preferences } from 'app/shared/model/preferences.model';
import { PreferencesService } from './preferences.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-preferences-update',
  templateUrl: './preferences-update.component.html'
})
export class PreferencesUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    weeklyGoal: [null, [Validators.required, Validators.min(10), Validators.max(21)]],
    weightUnits: [null, [Validators.required]],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected preferencesService: PreferencesService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ preferences }) => {
      this.updateForm(preferences);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(preferences: IPreferences) {
    this.editForm.patchValue({
      id: preferences.id,
      weeklyGoal: preferences.weeklyGoal,
      weightUnits: preferences.weightUnits,
      user: preferences.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const preferences = this.createFromForm();
    if (preferences.id !== undefined) {
      this.subscribeToSaveResponse(this.preferencesService.update(preferences));
    } else {
      this.subscribeToSaveResponse(this.preferencesService.create(preferences));
    }
  }

  private createFromForm(): IPreferences {
    return {
      ...new Preferences(),
      id: this.editForm.get(['id']).value,
      weeklyGoal: this.editForm.get(['weeklyGoal']).value,
      weightUnits: this.editForm.get(['weightUnits']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPreferences>>) {
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
