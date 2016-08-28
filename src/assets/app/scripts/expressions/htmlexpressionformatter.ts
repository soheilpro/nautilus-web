import * as NQL from '../nql/nql'
import { Nautilus, IEntity } from '../nautilus';

export class HTMLExpressionFormatter extends NQL.ExpressionVisitor<string, {}> {
  format(expression: NQL.IExpression, context: {}) {
    return this.visit(expression, context);
  }

  visitAnd(expression: NQL.AndExpression, context: {}) {
    return `<span class="expression expression-and">${expression.children.map(e => {
      if (e instanceof NQL.OrExpression)
        return `(${this.visit(e, context)})`;

      return this.visit(e, context)
    }).join(' <span class="expression-and-operator">AND</span> ')}</span>`;
  }

  visitCast(expression: NQL.CastExpression, context: {}) {
    return `<span class="expression expression-cast">(${expression.type})(${this.visit(expression.child, context)})<span>`;
  }

  visitComparison(expression: NQL.ComparisonExpression, context: {}) {
    return `<span class="expression expression-comparison">${this.visit(expression.left, context)} <span class="expression-comparison-operator">${expression.operator}</span> ${this.visit(expression.right, context)}</span>`
  }

  visitConstant(expression: NQL.ConstantExpression, context: {}) {
    var title: string;

    if (expression.type === 'Milestone')
      title = Nautilus.Instance.getMilestoneById((expression.value as IEntity).id).getFullTitle();

    if (expression.type === 'Project')
      title = Nautilus.Instance.getProjectById((expression.value as IEntity).id).name;

    if (expression.type === 'ItemArea')
      title = Nautilus.Instance.getItemAreaById((expression.value as IEntity).id).title;

    if (expression.type === 'ItemType')
      title = Nautilus.Instance.getIssueTypeById((expression.value as IEntity).id).title;

    if (expression.type === 'ItemPriority')
      title = Nautilus.Instance.getItemPriorityById((expression.value as IEntity).id).title;

    if (expression.type === 'ItemState')
      title = Nautilus.Instance.getItemStateById((expression.value as IEntity).id).title;

    if (expression.type === 'User')
      title = Nautilus.Instance.getUserById((expression.value as IEntity).id).name;

    return `<span class="expression expression-constant"><span class="${expression.type.toLowerCase()}">${title}</span></span>`;
  }

  visitList(expression: NQL.ListExpression, context: {}) {
    return `<span class="expression expression-list">[${expression.children.map(e => this.visit(e, context)).join(', ')}]</span>`;
  }

  visitLocal(expression: NQL.LocalExpression, context: {}) {
    return `<span class="expression expression-local">${expression.name}</span>`;
  }

  visitMethodCall(expression: NQL.MethodCallExpression, context: {}) {
    return `<span class="expression expression-method-call">${this.visit(expression.target, context)}.${expression.name}(${expression.args.map(e => this.visit(e, context)).join(',')})</span>`;
  }

  visitOr(expression: NQL.OrExpression, context: {}) {
    return `<span class="expression expression-or">${expression.children.map(e => {
      if (e instanceof NQL.AndExpression)
        return `(${this.visit(e, context)})`;

      return this.visit(e, context)
    }).join(' <span class="expression-or-operator">OR</span> ')}</span>`;
  }

  visitProperty(expression: NQL.PropertyExpression, context: {}) {
    return `<span class="expression expression-property">${this.visit(expression.target, context)}.${expression.name}</span>`;
  }
}
