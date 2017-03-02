import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { IConfiguration } from './iconfiguration';

export class Configuration implements IConfiguration {
  id: string;
  name: string;
  issueFilterQuery: NQL.Expression;
  taskFilterQuery: NQL.Expression;

  isEmpty() {
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

    const configuration = new Configuration();
    configuration.id = json.id;
    configuration.name = json.name;
    configuration.issueFilterQuery = json.issueFilterQuery ? expressionObjectConverter.parse(json.issueFilterQuery) : undefined;
    configuration.taskFilterQuery = json.taskFilterQuery ? expressionObjectConverter.parse(json.taskFilterQuery) : undefined;

    return configuration;
  }

  static create({ name, issueFilterQuery, taskFilterQuery }: { name?: string, issueFilterQuery?: NQL.Expression, taskFilterQuery?: NQL.Expression } = {}) {
    const configuration = new Configuration();
    configuration.id = uuid().replace(/-/g, '');
    configuration.name = name;
    configuration.issueFilterQuery = issueFilterQuery;
    configuration.taskFilterQuery = taskFilterQuery;

    return configuration;
  }
}
