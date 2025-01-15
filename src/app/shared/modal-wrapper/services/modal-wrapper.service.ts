import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalWrapperRequest } from '../models/modal-wrapper-request.model';

@Injectable({ providedIn: 'root' })
export class ModalWrapperService {
  private readonly modalWrapperSubject$ = new Subject<ModalWrapperRequest>();

  getModalWrapperSubject() {
    return this.modalWrapperSubject$.asObservable();
  }

  requestModalWrapper(request: ModalWrapperRequest) {
    this.modalWrapperSubject$.next(request);
  }
}
