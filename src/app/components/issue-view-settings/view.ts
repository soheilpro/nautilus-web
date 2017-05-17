import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { IView } from './iview';

export class View implements IView {
  id: string;
  name: string;
  filterQuery: NQL.Expression;

  isDefault() {
    return !this.filterQuery;
  }

  toJSON() {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    return {
      id: this.id,
      name: this.name,
      filterQuery: this.filterQuery ? expressionObjectConverter.convert(this.filterQuery) : undefined,
    };
  }

  static fromJSON(json: any) {
    const expressionObjectConverter = new NQL.ExpressionJSONConverter();

    const view = new View();
    view.id = json.id;
    view.name = json.name;
    view.filterQuery = json.filterQuery ? expressionObjectConverter.parse(json.filterQuery) : undefined;

    return view;
  }

  static create({ name, filterQuery }: { name?: string, filterQuery?: NQL.Expression } = {}) {
    const view = new View();
    view.id = uuid().replace(/-/g, '');
    view.name = name;
    view.filterQuery = filterQuery;

    return view;
  }
}
