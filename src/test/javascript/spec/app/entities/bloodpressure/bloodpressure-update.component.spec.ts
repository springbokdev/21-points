/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodpressureUpdateComponent } from 'app/entities/bloodpressure/bloodpressure-update.component';
import { BloodpressureService } from 'app/entities/bloodpressure/bloodpressure.service';
import { Bloodpressure } from 'app/shared/model/bloodpressure.model';

describe('Component Tests', () => {
  describe('Bloodpressure Management Update Component', () => {
    let comp: BloodpressureUpdateComponent;
    let fixture: ComponentFixture<BloodpressureUpdateComponent>;
    let service: BloodpressureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TwentyOnePointsTestModule],
        declarations: [BloodpressureUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(BloodpressureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BloodpressureUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BloodpressureService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Bloodpressure(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Bloodpressure();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
