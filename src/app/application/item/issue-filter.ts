import NQL from '../../nql';
import { IIssue } from './iissue';

export default class IssueFilter {
  getPredicate(query: NQL.IExpression): (item: IIssue) => boolean {
    const normalizedQuery = new QueryNormalizer().tranform(query, null);

    const types =  [
      { name: 'ItemType', base: 'Entity' },
      { name: 'Project', base: 'Entity' },
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

    throw new Error('Not supported.');
  }
}
