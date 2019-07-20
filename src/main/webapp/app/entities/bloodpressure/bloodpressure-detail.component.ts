import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBloodpressure } from 'app/shared/model/bloodpressure.model';

@Component({
  selector: 'jhi-bloodpressure-detail',
  templateUrl: './bloodpressure-detail.component.html'
})
export class BloodpressureDetailComponent implements OnInit {
  bloodpressure: IBloodpressure;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ bloodpressure }) => {
      this.bloodpressure = bloodpressure;
    });
  }

  previousState() {
    window.history.back();
  }
}
