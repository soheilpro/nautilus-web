import * as NQL from '../../nql';
import { ITask } from './itask';

export default class TaskFilter {
  getPredicate(query: NQL.IExpression): (task: ITask) => boolean {
    const normalizedQuery = new QueryNormalizer().tranform(query, null);

    const types =  [
      { name: 'ItemType',  base: 'Entity' },
      { name: 'ItemState', base: 'Entity' },
      { name: 'User',      base: 'Entity' },
    ];

    const compiler = new NQL.ExpressionCompiler(types);

    return compiler.compile(normalizedQuery, ['task']) as any;
  }
}

class QueryNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}) {
    if (['type'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('task'), expression.name), 'ItemType');

    if (['state'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('task'), expression.name), 'ItemState');

    if (['assignedTo', 'createdBy'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('task'), expression.name), 'User');

    throw new Error('Not supported.');
  }
}
