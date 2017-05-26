import { IDialog } from './idialog';

export interface IDialogController {
  showDialog(dialog: IDialog): void;
  showErrorDialog(options: { title: string, message: string }): void;
  showConfirmDialog(options: { title: string, message: string, buttonTitle?: string, isDestructive?: boolean, onConfirm: () => void }): void;
}
