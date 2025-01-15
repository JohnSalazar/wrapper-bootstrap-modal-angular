import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { Customer } from '@components/customer/models/customer.model';
import { ModalEnum } from '@shared/modal-wrapper/enums/modal-enum-type.enum';
import { ModalData } from '@shared/modal-wrapper/models/modal-data.interface';
import { Subject, takeUntil } from 'rxjs';
import { CustomerComponent } from '../../customer/customer.component';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-customer-register-modal',
  standalone: true,
  template: `
    <div
      [id]="modalData.modalName"
      class="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      [attr.aria-labelledby]="modalData.modalName"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" (click)="cancel()"></button>
          </div>
          <div class="modal-body">
            @if(customer.id) {
            <app-customer [setCustomer]="customer" />
            }
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CustomerComponent],
})
export class CustomerRegisterModalComponent
  implements AfterViewInit, OnDestroy
{
  private readonly modalService = inject(ModalService);

  private readonly modalSubject$ = this.modalService.getModalSubject();
  private readonly destroy$ = new Subject<boolean>();

  protected readonly modalData: ModalData = {
    modalName: ModalEnum.CustomerRegister,
  };

  protected customer = {} as Customer;

  ngAfterViewInit(): void {
    this.modalSubject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.modalName == this.modalData.modalName) {
          this.customer = response.data;
        }
      },
      error: (error) => alert(`load modal error: ${error}`),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected cancel() {
    this.modalData.data = this.customer;
    this.modalService.closeWithResponse(this.modalData);
  }
}
