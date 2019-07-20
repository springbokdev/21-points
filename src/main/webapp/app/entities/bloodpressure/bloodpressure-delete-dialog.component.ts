import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBloodpressure } from 'app/shared/model/bloodpressure.model';
import { BloodpressureService } from './bloodpressure.service';

@Component({
  selector: 'jhi-bloodpressure-delete-dialog',
  templateUrl: './bloodpressure-delete-dialog.component.html'
})
export class BloodpressureDeleteDialogComponent {
  bloodpressure: IBloodpressure;

  constructor(
    protected bloodpressureService: BloodpressureService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.bloodpressureService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'bloodpressureListModification',
        content: 'Deleted an bloodpressure'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-bloodpressure-delete-popup',
  template: ''
})
export class BloodpressureDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ bloodpressure }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(BloodpressureDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.bloodpressure = bloodpressure;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/bloodpressure', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/bloodpressure', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
