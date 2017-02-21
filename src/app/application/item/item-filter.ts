import * as NQL from '../../nql';
import { IApplication } from '../iapplication';
import { IItem } from '../../sdk';

export default class ItemFilter {
  constructor(private application: IApplication) {
  }

  getPredicate(query: NQL.IExpression): (item: IItem) => boolean {
    let normalizedQuery = new QueryNormalizer(this.application).tranform(query, null);

    let types =  [
      { name: 'ItemPriority', base: 'Entity' },
      { name: 'ItemState', base: 'Entity' },
      { name: 'ItemType', base: 'Entity' },
      { name: 'Milestone', base: 'Entity' },
      { name: 'Project', base: 'Entity' },
      { name: 'User', base: 'Entity' },
    ];

    let compiler = new NQL.ExpressionCompiler(types);

    return compiler.compile(normalizedQuery, ['item']) as any;
  }
}

class QueryNormalizer extends NQL.ExpressionTransformer<{}> {
  constructor(private application: IApplication) {
    super();
  }

  visitLocal(expression: NQL.LocalExpression, context: {}) {
    if (['project'].some(name => name === expression.name)) {
      // Convert: project => (Project)item.project
      return new NQL.CastExpression(new NQL.PropertyExpression(new NQL.LocalExpression('item'), expression.name), 'Project');
    }

    return super.visitLocal(expression, context);
  }
}
