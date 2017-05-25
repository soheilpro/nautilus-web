import { IDialog } from './idialog';

export interface IDialogController {
  showDialog(dialog: IDialog): void;
}
