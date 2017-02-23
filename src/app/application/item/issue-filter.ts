import * as NQL from '../../nql';
import { IIssue } from './iissue';

export default class IssueFilter {
  getPredicate(query: NQL.IExpression): (item: IIssue) => boolean {
    let normalizedQuery = new QueryNormalizer().tranform(query, null);

    let types =  [
      { name: 'IssueType', base: 'Entity' },
      { name: 'Project', base: 'Entity' },
    ];

    let compiler = new NQL.ExpressionCompiler(types);

    return compiler.compile(normalizedQuery, ['issue']) as any;
  }
}

class QueryNormalizer extends NQL.ExpressionTransformer<{}> {
  visitLocal(expression: NQL.LocalExpression, context: {}) {
    if (['project'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'Project');

    if (['type'].some(name => name === expression.name))
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('issue'), expression.name), 'IssueType');

    return super.visitLocal(expression, context);
  }
}
