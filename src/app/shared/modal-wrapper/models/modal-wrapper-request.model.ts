import { ModalWrapperCommandType } from '../enums/modal-wrapper-command-type.enum';
import { ModalData } from './modal-data.interface';

export interface ModalWrapperRequest {
  command: ModalWrapperCommandType;
  modalData?: ModalData;
}
