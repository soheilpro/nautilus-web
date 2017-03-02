import * as NQL from '../../nql';

export interface IConfiguration {
  id: string;
  name: string;
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
  isEmpty(): boolean;
  toJSON(): Object;
}
