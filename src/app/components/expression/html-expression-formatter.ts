import * as NQL from '../../nql';
import { IApplication } from '../../application';

export default class HTMLExpressionFormatter extends NQL.ExpressionVisitor<string, {}> {
  constructor(private application: IApplication) {
    super();
  }

  format(expression: NQL.IExpression, context: {}) {
    return this.visit(expression, context);
  }

  visitAnd(expression: NQL.AndExpression, context: {}) {
    return `<span class="expression expression-and">${expression.children.map(e => {
      if (e instanceof NQL.OrExpression)
        return `(${this.visit(e, context)})`;

      return this.visit(e, context);
    }).join(' <span class="expression-and-operator">AND</span> ')}</span>`;
  }

  visitCast(expression: NQL.CastExpression, context: {}) {
    return `<span class="expression expression-cast">(${expression.type})(${this.visit(expression.child, context)})<span>`;
  }

  visitComparison(expression: NQL.ComparisonExpression, context: {}) {
    return `<span class="expression expression-comparison">${this.visit(expression.left, context)} <span class="expression-comparison-operator">${expression.operator}</span> ${this.visit(expression.right, context)}</span>`;
  }

  visitConstant(expression: NQL.ConstantExpression, context: {}) {
    let title: string;

    // if (expression.type === 'Milestone')
    //   title = this.application.getMilestoneById((expression.value as IEntity).id).getFullTitle();

    if (expression.type === 'Project')
      title = this.application.projects.get(expression.value).name;

    if (expression.type === 'IssueType')
      title = this.application.issueTypes.get(expression.value).title;

    // if (expression.type === 'ItemPriority')
    //   title = this.application.getItemPriorityById((expression.value as IEntity).id).title;

    // if (expression.type === 'ItemState')
    //   title = this.application.getItemStateById((expression.value as IEntity).id).title;

    // if (expression.type === 'User')
    //   title = this.application.getUserById((expression.value as IEntity).id).name;

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

      return this.visit(e, context);
    }).join(' <span class="expression-or-operator">OR</span> ')}</span>`;
  }

  visitProperty(expression: NQL.PropertyExpression, context: {}) {
    return `<span class="expression expression-property">${this.visit(expression.target, context)}.${expression.name}</span>`;
  }
}
