import * as NQL from '../../nql';

export interface IView {
  id: string;
  name: string;
  filterExpression?: NQL.Expression;
  sortExpressions?: NQL.ISortExpression[];
  isDefault(): boolean;
  toJSON(): Object;
}
