import { AndExpression } from './expressions/and';
import { CastExpression } from './expressions/cast';
import { ComparisonExpression } from './expressions/comparison';
import { ConstantExpression } from './expressions/constant';
import { ExpressionVisitor } from './expression-visitor';
import { IExpression } from './iexpression';
import { IType } from './itype';
import { ListExpression } from './expressions/list';
import { LocalExpression } from './expressions/local';
import { MethodCallExpression } from './expressions/method-call';
import { OrExpression } from './expressions/or';
import { PropertyExpression } from './expressions/property';
import TypeSystem from './type-system';

interface IContext {
}

export class ExpressionCompiler extends ExpressionVisitor<any, IContext> {
  private typeSystem = new TypeSystem();

  constructor(types: IType[]) {
    super();

    this.typeSystem.registerTypes(types);
  }

  compile(expression: IExpression): Function {
    let context: IContext = {};

    return new Function('locals', `return ${this.visit(expression, context)};`);
  }

  visitAnd(expression: AndExpression, context: IContext): string {
    return expression.children.map(child => `(${this.visit(child, context)})`).join(' && ');
  }

  visitCast(expression: CastExpression, context: IContext): string {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IContext): string {
    let leftReturnType = this.typeSystem.get(expression.left.returnType);
    let rightReturnType = this.typeSystem.get(expression.right.returnType);

    if (!leftReturnType)
      throw new Error(`Unkown type '${expression.left.returnType}'.`);

    if (!rightReturnType)
      throw new Error(`Unkown type '${expression.right.returnType}'.`);

    let commonReturnType = this.typeSystem.getCommonType(leftReturnType, rightReturnType);

    if (!commonReturnType)
      throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

    let left = this.visit(expression.left, context);
    let right = this.visit(expression.right, context);

    let entityType = this.typeSystem.get('Entity');

    if (this.typeSystem.isOfType(commonReturnType, entityType)) {
      left = `(${left}).id`;
      right = `(${right}).id`;
    }

    switch (expression.operator) {
      case '==':
        return `(${left} === ${right})`;

      case '!=':
        return `(${left} !== ${right})`;

      default:
        throw new Error('Not supported.');
    }
  }

  visitConstant(expression: ConstantExpression, context: IContext): string {
    return JSON.stringify(expression.value);
  }

  visitList(expression: ListExpression, context: IContext): string {
    return `[${expression.children.map(e => this.visit(e, context))}]`;
  }

  visitLocal(expression: LocalExpression, context: IContext): string {
    return `locals['${expression.name}']`;
  }

  visitMethodCall(expression: MethodCallExpression, context: IContext): string {
    let target = this.visit(expression.target, context);
    let name = expression.name;
    let args = expression.args.map(e => this.visit(e, context));

    return `(${target}).${name}(${args.join(',')})`;
  }

  visitOr(expression: OrExpression, context: IContext): string {
    return expression.children.map(child => `(${this.visit(child, context)})`).join(' || ');
  }

  visitProperty(expression: PropertyExpression, context: IContext): string {
    let target = this.visit(expression.target, context);
    let name = expression.name;

    return `(${target})['${name}']`;
  }
}
