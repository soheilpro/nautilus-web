import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { IView } from './iview';

export class View implements IView {
  id: string;
  name: string;
  issueFilterQuery: NQL.Expression;

  isDefault() {
    return !this.issueFilterQuery;
  }

  toJSON() {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    return {
      id: this.id,
      name: this.name,
      issueFilterQuery: this.issueFilterQuery ? expressionObjectConverter.convert(this.issueFilterQuery) : undefined,
    };
  }

  static fromJSON(json: any) {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    const view = new View();
    view.id = json.id;
    view.name = json.name;
    view.issueFilterQuery = json.issueFilterQuery ? expressionObjectConverter.parse(json.issueFilterQuery) : undefined;

    return view;
  }

  static create({ name, issueFilterQuery }: { name?: string, issueFilterQuery?: NQL.Expression } = {}) {
    const view = new View();
    view.id = uuid().replace(/-/g, '');
    view.name = name;
    view.issueFilterQuery = issueFilterQuery;

    return view;
  }
}
