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

  compile(expression: IExpression, args: string[]) {
    let context: IContext = {};

    return new Function(...args, `return ${this.visit(expression, context)};`);
  }

  visitAnd(expression: AndExpression, context: IContext): string {
    return expression.children.map(child => `(${this.visit(child, context)})`).join(' && ');
  }

  visitCast(expression: CastExpression, context: IContext): string {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IContext): string {
    switch (expression.operator) {
      case '==':
      case '!=':
        return this.visitComparisonEquality(expression.left, expression.right, expression.operator, context);

      case 'IN':
      case 'NOT IN':
        return this.visitComparisonInclusion(expression.left, expression.right, expression.operator, context);

      default:
        throw new Error('Not supported.');
    }
  }

  private visitComparisonEquality(left: IExpression, right: IExpression, operator: string, context: IContext): string {
    let leftReturnType = this.typeSystem.getType(left.returnType);
    let rightReturnType = this.typeSystem.getType(right.returnType);

    if (!leftReturnType)
      throw new Error(`Unkown type '${left.returnType}'.`);

    if (!rightReturnType)
      throw new Error(`Unkown type '${right.returnType}'.`);

    let commonReturnType = this.typeSystem.getCommonType(leftReturnType, rightReturnType);

    if (!commonReturnType)
      throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

    let leftValue = this.visit(left, context);
    let rightValue = this.visit(right, context);
    let targetOperator: string;

    switch (operator) {
      case '==': targetOperator = '==='; break;
      case '!=': targetOperator = '!=='; break;
      default: throw new Error('Not supported.');
    }

    if (this.typeSystem.isOfType(commonReturnType, 'Entity'))
      return `${leftValue} && ${rightValue} && (${leftValue}).id ${targetOperator} (${rightValue}).id`;

    return `${leftValue} ${targetOperator} ${rightValue}`;
  }

  private visitComparisonInclusion(left: IExpression, right: IExpression, operator: string, context: IContext): string {
    let leftReturnType = this.typeSystem.getType(left.returnType);

    if (!leftReturnType)
      throw new Error(`Unkown type '${left.returnType}'.`);

    if (!(right instanceof ListExpression))
        throw new Error(`${operator} operator expects a List.`);

    switch (operator) {
      case 'IN':
        return right.children.map(child => this.visitComparisonEquality(left, child, '==', context)).join(' || ');

      case 'NOT IN':
        return right.children.map(child => this.visitComparisonEquality(left, child, '!=', context)).join(' && ');

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
    return expression.name;
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

    return `(${target}).${name}`;
  }
}
