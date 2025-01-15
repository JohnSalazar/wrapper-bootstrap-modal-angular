import { Component, inject } from '@angular/core';
import { ModalEnum } from '@shared/modal-wrapper/enums/modal-enum-type.enum';
import { ModalData } from '@shared/modal-wrapper/models/modal-data.interface';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-delete-item-modal',
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
      [style]="'z-index: 2010'"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="card">
              <div class="card-body p-4">
                <div class="text-center">
                  <div class="row justify-content-center">
                    <div class="col-10">
                      <h4 class="text-danger">Delete Item</h4>
                      <p class="font-size-14 mb-2">DELETE current item?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-2">
              <button (click)="confirm()" type="button" class="btn btn-danger">
                Delete item
              </button>
              <button
                (click)="reject()"
                type="button"
                class="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DeleteItemModalComponent {
  private readonly modalService = inject(ModalService);

  protected readonly modalData: ModalData = { modalName: ModalEnum.DeleteItem };

  protected confirm() {
    this.modalService.closeWithResponse(this.modalData, true);
  }

  protected reject() {
    this.modalService.closeWithResponse(this.modalData, false);
  }
}
