import * as NQL from '../../nql';

export interface IView {
  id: string;
  name: string;
  issueFilterQuery?: NQL.Expression;
  isDefault(): boolean;
  toJSON(): Object;
}
