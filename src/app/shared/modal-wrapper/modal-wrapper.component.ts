import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerRegisterModalComponent } from '@components/modals/customer/customer-register-modal.component';
import { DeleteItemModalComponent } from '@components/modals/delete-item/delete-item-modal.component';
import { ModalEnum } from './enums/modal-enum-type.enum';
import { ModalWrapperCommandType } from './enums/modal-wrapper-command-type.enum';
import { ModalData } from './models/modal-data.interface';
import { ModalWrapperRequest } from './models/modal-wrapper-request.model';
import { ModalWrapperService } from './services/modal-wrapper.service';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  template: '<ng-container #modalContainer />',
})
export class ModalWrapperComponent implements OnDestroy {
  @ViewChild('modalContainer', { read: ViewContainerRef })
  private readonly modalContainer!: ViewContainerRef;

  private readonly modalWrapperService = inject(ModalWrapperService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly modalWrapperSubject$ =
    this.modalWrapperService.getModalWrapperSubject();

  private readonly componentRefs: ComponentRef<any>[] = [];

  constructor() {
    this.modalWrapperSubject$
      .pipe(takeUntilDestroyed())
      .subscribe((request) => {
        if (request && request.modalData) {
          if (request.command === ModalWrapperCommandType.Create)
            this.selectModal(request.modalData);

          if (request.command === ModalWrapperCommandType.Destroy)
            this.destroyComponent(request.modalData);

          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyAllComponents();
  }

  private selectModal(modalData: ModalData) {
    let componentType: any = null;

    switch (modalData.modalName) {
      case ModalEnum.DeleteItem:
        componentType = DeleteItemModalComponent;
        break;
      case ModalEnum.CustomerRegister:
        componentType = CustomerRegisterModalComponent;
        break;
    }

    if (componentType) {
      this.renderComponent(componentType, modalData);
    }
  }

  private renderComponent(componentType: any, modalData: ModalData) {
    if (!componentType) return;

    const componentRef = this.modalContainer.createComponent(componentType);
    this.componentRefs.push(componentRef);

    const request: ModalWrapperRequest = {
      command: ModalWrapperCommandType.CanLoad,
      modalData: modalData,
    };

    this.modalWrapperService.requestModalWrapper(request);
  }

  private destroyComponent(modalData: ModalData) {
    const index = this.componentRefs.findIndex(
      (ref) => ref.instance.modalData.modalName === modalData.modalName
    );
    if (index >= 0) {
      this.componentRefs[index].destroy();
      this.componentRefs.splice(index, 1);
    }
  }

  private destroyAllComponents() {
    this.componentRefs.forEach((ref) => ref.destroy());
  }
}
