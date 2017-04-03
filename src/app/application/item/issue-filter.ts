import * as NQL from '../../nql';
import { IIssue } from './iissue';

export default class IssueFilter {
  getPredicate(query: NQL.IExpression): (item: IIssue) => boolean {
    const normalizedQuery = new QueryNormalizer().tranform(query, null);

    const types =  [
      { name: 'ItemType',  base: 'Entity' },
      { name: 'ItemState', base: 'Entity' },
      { name: 'Project',   base: 'Entity' },
      { name: 'User',      base: 'Entity' },
    ];

    const compiler = new NQL.ExpressionCompiler(types);

    return compiler.compile(normalizedQuery, ['issue']) as any;
  }
}

class QueryNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}) {
    if (['project'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'Project');

    if (['type'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'ItemType');

    if (['priority'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'ItemPriority');

    if (['state'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'ItemState');

    if (['createdBy'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'User');

    throw new Error('Not supported.');
  }
}
