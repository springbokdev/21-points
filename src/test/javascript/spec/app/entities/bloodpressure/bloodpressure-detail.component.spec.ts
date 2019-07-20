/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodpressureDetailComponent } from 'app/entities/bloodpressure/bloodpressure-detail.component';
import { Bloodpressure } from 'app/shared/model/bloodpressure.model';

describe('Component Tests', () => {
  describe('Bloodpressure Management Detail Component', () => {
    let comp: BloodpressureDetailComponent;
    let fixture: ComponentFixture<BloodpressureDetailComponent>;
    const route = ({ data: of({ bloodpressure: new Bloodpressure(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TwentyOnePointsTestModule],
        declarations: [BloodpressureDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(BloodpressureDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BloodpressureDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bloodpressure).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
