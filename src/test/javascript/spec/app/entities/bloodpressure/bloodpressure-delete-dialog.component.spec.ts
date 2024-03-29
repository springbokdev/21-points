/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodpressureDeleteDialogComponent } from 'app/entities/bloodpressure/bloodpressure-delete-dialog.component';
import { BloodpressureService } from 'app/entities/bloodpressure/bloodpressure.service';

describe('Component Tests', () => {
  describe('Bloodpressure Management Delete Component', () => {
    let comp: BloodpressureDeleteDialogComponent;
    let fixture: ComponentFixture<BloodpressureDeleteDialogComponent>;
    let service: BloodpressureService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TwentyOnePointsTestModule],
        declarations: [BloodpressureDeleteDialogComponent]
      })
        .overrideTemplate(BloodpressureDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BloodpressureDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BloodpressureService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
