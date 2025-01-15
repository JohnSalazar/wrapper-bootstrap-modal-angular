import { inject, Injectable } from '@angular/core';
import { ModalEnum } from '@shared/modal-wrapper/enums/modal-enum-type.enum';
import { ModalWrapperCommandType } from '@shared/modal-wrapper/enums/modal-wrapper-command-type.enum';
import { ModalData } from '@shared/modal-wrapper/models/modal-data.interface';
import { ModalWrapperRequest } from '@shared/modal-wrapper/models/modal-wrapper-request.model';
import { ModalWrapperService } from '@shared/modal-wrapper/services/modal-wrapper.service';
import * as bootstrap from 'bootstrap';
import { Subject } from 'rxjs';

type ModalType = {
  [modalName: string]: { subject: Subject<any>; modal: bootstrap.Modal | null };
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly modalWrapperService = inject(ModalWrapperService);

  private readonly modals: ModalType = {};
  private readonly modalSubjectList = new Map<string, Subject<any>>();
  private readonly modalSubject$ = new Subject<{
    modalName: string;
    data: any;
  }>();

  private openModal: bootstrap.Modal | null = null;

  showModal(modalData: ModalData): Subject<any> {
    const subject = new Subject<any>();

    const modalExists = this.modals[modalData.modalName];
    if (modalExists !== undefined) {
      modalExists.modal?.toggle();
      modalExists.subject.next(modalData.data);
      return modalExists.subject;
    }

    this.modals[modalData.modalName] = { subject: subject, modal: null };

    const request: ModalWrapperRequest = {
      command: ModalWrapperCommandType.Create,
      modalData: modalData,
    };

    this.modalWrapperService.requestModalWrapper(request);

    this.loadModal(modalData);

    return subject;
  }

  closeWithResponse(modalData: ModalData, data: any = null) {
    if (data !== null) this.setData(modalData.modalName, data);

    const modalInfo = this.modals[modalData.modalName];

    if (modalInfo && modalInfo.subject) {
      modalInfo.subject.next(data);
      modalInfo.subject.complete();
      if (modalInfo.modal) {
        modalInfo.modal.hide();
        if (this.openModal === modalInfo.modal) {
          this.openModal = null;
          this.modals[modalData.modalName].subject.unsubscribe();
        }
      }
    }

    this.clearData(modalData.modalName);

    delete this.modals[modalData.modalName];

    const request: ModalWrapperRequest = {
      command: ModalWrapperCommandType.Destroy,
      modalData: modalData,
    };
    this.modalWrapperService.requestModalWrapper(request);
  }

  closeAllModals() {
    for (const modalName of Object.values(ModalEnum)) {
      const modalData: ModalData = { modalName: modalName };
      this.closeWithResponse(modalData, null);
    }
  }

  getModalSubject() {
    return this.modalSubject$.asObservable();
  }

  sendData(modalData: ModalData) {
    const modalInfo = this.modals[modalData.modalName];

    if (modalInfo && modalInfo.subject) modalInfo.subject.next(modalData.data);
  }

  private loadModal(modalData: ModalData) {
    try {
      const modalElement = document.getElementById(modalData.modalName);

      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        this.modals[modalData.modalName].modal = modal;
        modal.show();
        this.openModal = modal;
      }

      this.setData(modalData.modalName, modalData.data);
    } catch {}
  }

  private getOrCreateSubject(modalName: string): Subject<any> {
    if (!this.modalSubjectList.has(modalName)) {
      this.modalSubjectList.set(modalName, new Subject<any>());
    }

    return this.modalSubjectList.get(modalName)!;
  }

  private setData(modalName: string, data: any) {
    const subject = this.getOrCreateSubject(modalName);
    subject.next(data);

    this.modalSubject$.next({ modalName, data });
  }

  private clearData(modalName: string) {
    const subject = this.modalSubjectList.get(modalName);
    if (subject) {
      subject.complete();
      this.modalSubjectList.delete(modalName);

      this.modalSubject$.next({ modalName: modalName, data: undefined });
    }
  }
}
