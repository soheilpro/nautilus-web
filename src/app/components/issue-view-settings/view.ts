import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { IView } from './iview';

export class View implements IView {
  id: string;
  name: string;
  issueFilterQuery: NQL.Expression;
  taskFilterQuery: NQL.Expression;

  isDefault() {
    return !this.issueFilterQuery && !this.taskFilterQuery;
  }

  toJSON() {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    return {
      id: this.id,
      name: this.name,
      issueFilterQuery: this.issueFilterQuery ? expressionObjectConverter.convert(this.issueFilterQuery) : undefined,
      taskFilterQuery: this.taskFilterQuery ? expressionObjectConverter.convert(this.taskFilterQuery) : undefined,
    };
  }

  static fromJSON(json: any) {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    const view = new View();
    view.id = json.id;
    view.name = json.name;
    view.issueFilterQuery = json.issueFilterQuery ? expressionObjectConverter.parse(json.issueFilterQuery) : undefined;
    view.taskFilterQuery = json.taskFilterQuery ? expressionObjectConverter.parse(json.taskFilterQuery) : undefined;

    return view;
  }

  static create({ name, issueFilterQuery, taskFilterQuery }: { name?: string, issueFilterQuery?: NQL.Expression, taskFilterQuery?: NQL.Expression } = {}) {
    const view = new View();
    view.id = uuid().replace(/-/g, '');
    view.name = name;
    view.issueFilterQuery = issueFilterQuery;
    view.taskFilterQuery = taskFilterQuery;

    return view;
  }
}
