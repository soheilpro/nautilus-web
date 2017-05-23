import * as NQL from '../../nql';
import { IMilestone } from './imilestone';

export default class MilestoneFilter {
  getPredicate(query: NQL.IExpression): (item: IMilestone) => boolean {
    const normalizedQuery = new QueryNormalizer().tranform(query, null);

    const types =  [
      { name: 'ItemState',    base: 'Entity' },
      { name: 'Project',      base: 'Entity' },
      { name: 'User',         base: 'Entity' },
    ];

    const compiler = new NQL.ExpressionCompiler(types);

    return compiler.compile(normalizedQuery, ['milestone']) as any;
  }
}

class QueryNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}) {
    if (['project'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('milestone'), expression.name), 'Project');

    if (['state'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('milestone'), expression.name), 'ItemState');

    if (['createdBy'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('milestone'), expression.name), 'User');

    throw new Error('Not supported.');
  }
}
