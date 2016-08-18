import { IExpression } from './expression'
import { ExpressionTransformer } from './expressiontransformer'
import { ExpressionVisitor } from './expressionvisitor'
import { AndExpression } from './expressions/and'
import { CastExpression } from './expressions/cast'
import { ComparisonExpression } from './expressions/comparison'
import { ConstantExpression } from './expressions/constant'
import { ListExpression } from './expressions/list'
import { LocalExpression } from './expressions/local'
import { MethodCallExpression } from './expressions/methodcall'
import { OrExpression } from './expressions/or'
import { PropertyExpression } from './expressions/property'

export interface IEvaluationContext {
  types: [
    {
      name: string;
      base?: string;
    }
  ],
  locals: {
    [key: string]: any;
  }
}

export class ExpressionEvaluator extends ExpressionVisitor<any, IEvaluationContext> {
  evaluate(expression: IExpression, context: IEvaluationContext): any {
    context.types.push({ name: 'Boolean' });
    context.types.push({ name: 'Number' });
    context.types.push({ name: 'String' });
    context.types.push({ name: 'Entity' });

    return this.visit(expression, context);
  }

  visitAnd(expression: AndExpression, context: IEvaluationContext): any {
    for (var child of expression.children)
      if (!this.visit(child, context))
        return false;

    return true;
  }

  visitCast(expression: CastExpression, context: IEvaluationContext): any {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IEvaluationContext): any {
    var areEqual = (left: IExpression, right: IExpression) => {
      var leftReturnType = context.types.filter(t => t.name === left.returnType())[0];
      var rightReturnType = context.types.filter(t => t.name === right.returnType())[0];

      if (!leftReturnType)
        throw new Error(`Unkown type '${left.returnType()}'.`);

      if (!rightReturnType)
        throw new Error(`Unkown type '${right.returnType()}'.`);

      if (leftReturnType !== rightReturnType)
        throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

      var returnType = leftReturnType;
      var leftValue = this.visit(left, context);
      var rightValue = this.visit(right, context);

      if (returnType.name === 'Boolean')
        return leftValue === rightValue;

      if (returnType.name === 'Number')
        return leftValue === rightValue;

      if (returnType.name === 'String')
        return leftValue === rightValue;

      if (returnType.name === 'Entity' || returnType.base === 'Entity')
        return leftValue && rightValue && leftValue.id === rightValue.id;

      return false;
    };

    var isIn = (left: IExpression, right: IExpression) => {
      var rightReturnType = right.returnType();

      if (rightReturnType != 'List')
        throw new Error(`IN/NOT IN operators expect a List but got '${rightReturnType}' instead.`);

      return (right as ListExpression).children.some(e => areEqual(left, e));
    };

    switch (expression.operator) {
      case '==':
        return areEqual(expression.left, expression.right);

      case '!=':
        return !areEqual(expression.left, expression.right);

      case 'IN':
        return isIn(expression.left, expression.right);

      case 'NOT IN':
        return !isIn(expression.left, expression.right);

      default:
        throw new Error('Not Implemented');
    }
  }

  visitConstant(expression: ConstantExpression, context: IEvaluationContext): any {
    return expression.value;
  }

  visitList(expression: ListExpression, context: IEvaluationContext): any {
    return expression.children.map(e => this.visit(e, context));
  }

  visitLocal(expression: LocalExpression, context: IEvaluationContext): any {
    return context.locals[expression.name];
  }

  visitMethodCall(expression: MethodCallExpression, context: IEvaluationContext): any {
    var targetValue = this.visit(expression.target, context);
    var argValues = expression.args.map(e => this.visit(e, context));

    return targetValue[expression.name].call(targetValue, argValues);
  }

  visitOr(expression: OrExpression, context: IEvaluationContext): any {
    for (var child of expression.children)
      if (this.visit(child, context))
        return true;

    return false;
  }

  visitProperty(expression: PropertyExpression, context: IEvaluationContext): any {
    var targetValue = this.visit(expression.target, context);

    return targetValue[expression.name];
  }
}
