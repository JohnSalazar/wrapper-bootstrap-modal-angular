import { Component, inject } from '@angular/core';
import { Customer } from '@components/customer/models/customer.model';
import { ModalService } from '@components/modals/services/modal.service';
import { ModalEnum } from '@shared/modal-wrapper/enums/modal-enum-type.enum';
import { ModalData } from '@shared/modal-wrapper/models/modal-data.interface';
import { take } from 'rxjs';
import { ModalWrapperComponent } from './shared/modal-wrapper/modal-wrapper.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <button type="button" class="btn btn-primary" (click)="register()">
        Register new customer
      </button>
      <button type="button" class="btn btn-danger" (click)="delete()">
        Delete item
      </button>
    </div>

    <app-modal-wrapper />
  `,
  imports: [ModalWrapperComponent],
})
export class AppComponent {
  private readonly modalService = inject(ModalService);

  protected register() {
    const customer = {
      id: '1',
      name: '',
      age: 0,
    } as Customer;

    const modalData: ModalData = {
      modalName: ModalEnum.CustomerRegister,
      data: customer,
    };

    this.modalService
      .showModal(modalData)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const message = response
            ? 'customer registered'
            : 'register canceled';

          alert(message);
          console.log(response ? 'customer: ' : 'canceled', response);
        },
      });
  }

  protected delete() {
    const modalData: ModalData = { modalName: ModalEnum.DeleteItem };

    this.modalService
      .showModal(modalData)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const message = response ? 'item deleted ' : 'deletion cancelled';

          alert(message);
        },
      });
  }
}
