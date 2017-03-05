import * as NQL from '../../nql';

export interface IView {
  id: string;
  name: string;
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
  isDefault(): boolean;
  toJSON(): Object;
}
