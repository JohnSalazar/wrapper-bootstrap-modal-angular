import { Component, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '@components/modals/services/modal.service';
import { ModalEnum } from '@shared/modal-wrapper/enums/modal-enum-type.enum';
import { ModalData } from '@shared/modal-wrapper/models/modal-data.interface';
import { Customer } from './models/customer.model';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="card-body">
        @if(customer) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-8">
              <label for="name">Name: </label>
              <input
                class="form-control"
                type="text"
                formControlName="name"
                [class]="{
                  'is-invalid': submitted && form.controls['name'].errors
                }"
              />
              @if(submitted && form.controls['name'].errors){
              <div class="invalid-feedback">
                <div class="d-flex flex-column">
                  @if(form.controls['name'].hasError('required')){
                  <div>name is required.</div>
                  } @if(form.controls['name'].hasError('maxlength')){
                  <div>
                    maximum size for name is
                    {{
                      form.controls['name'].errors['maxlength']?.requiredLength
                    }}
                    characters.
                  </div>
                  }
                </div>
              </div>
              }
            </div>
            <div class="col-md-4">
              <label for="age">Age: </label>
              <input
                class="form-control"
                type="text"
                formControlName="age"
                [class]="{
                  'is-invalid': submitted && form.controls['age'].errors
                }"
              />
              @if(submitted && form.controls['age'].errors){
              <div class="invalid-feedback">
                <div class="d-flex flex-column">
                  @if(form.controls['age'].hasError('required')){
                  <div>age is required.</div>
                  } @if(form.controls['age'].hasError('min')){
                  <div>
                    minimum age is
                    {{ form.controls['age'].errors['min']?.min }}.
                  </div>
                  }@if(form.controls['age'].hasError('max')){
                  <div>
                    maximum age is
                    {{ form.controls['age'].errors['max']?.max }}.
                  </div>
                  }
                </div>
              </div>
              }
            </div>
          </div>
          <div class="row mt-3">
            <div class="d-flex justify-content-evenly">
              <button
                class="btn btn-primary me-3"
                type="submit"
                [disabled]="!customer || !customer.id"
              >
                Register
              </button>
              <button
                class="btn btn-secondary"
                type="button"
                (click)="cancel()"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        }
      </div>
    </div>
  `,
})
export class CustomerComponent {
  setCustomer = input<Customer>();

  private readonly modalService = inject(ModalService);

  private readonly modalData: ModalData = {
    modalName: ModalEnum.CustomerRegister,
  };

  protected customer: Customer | undefined;
  protected form = {} as FormGroup;
  protected submitted = false;

  constructor() {
    this.createForm();

    toObservable(this.setCustomer)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (customer) => {
          this.customer = customer;
          if (this.customer) this.updateForm();
        },
      });
  }

  protected onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.modalService.closeWithResponse(this.modalData, this.customer);
  }

  protected cancel() {
    this.modalService.closeWithResponse(this.modalData);
  }

  private createForm() {
    this.form = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(150),
      ]),
      age: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(150),
      ]),
    });
  }

  private updateForm() {
    if (!this.customer) return;

    this.form.setValue(this.customer);
  }
}
