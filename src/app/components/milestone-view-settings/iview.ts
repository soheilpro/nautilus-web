import * as NQL from '../../nql';

export interface IView {
  id: string;
  name: string;
  filterQuery?: NQL.Expression;
  isDefault(): boolean;
  toJSON(): Object;
}
