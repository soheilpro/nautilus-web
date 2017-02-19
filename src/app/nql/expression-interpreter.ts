import * as _ from 'underscore';
import { IExpression } from './iexpression';
import { ExpressionVisitor } from './expression-visitor';
import { AndExpression } from './expressions/and';
import { CastExpression } from './expressions/cast';
import { ComparisonExpression } from './expressions/comparison';
import { ConstantExpression } from './expressions/constant';
import { ListExpression } from './expressions/list';
import { LocalExpression } from './expressions/local';
import { MethodCallExpression } from './expressions/method-call';
import { OrExpression } from './expressions/or';
import { PropertyExpression } from './expressions/property';

export interface IInterpreterContext {
  types: {
    name: string;
    base?: string;
  }[];

  locals: {
    [key: string]: any;
  };
}

export class ExpressionInterpreter extends ExpressionVisitor<any, IInterpreterContext> {
  evaluate(expression: IExpression, context: IInterpreterContext): any {
    context.types.push({ name: 'Boolean' });
    context.types.push({ name: 'Number' });
    context.types.push({ name: 'String' });
    context.types.push({ name: 'Entity' });

    return this.visit(expression, context);
  }

  visitAnd(expression: AndExpression, context: IInterpreterContext): any {
    for (let child of expression.children)
      if (!this.visit(child, context))
        return false;

    return true;
  }

  visitCast(expression: CastExpression, context: IInterpreterContext): any {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IInterpreterContext): any {
    let areEqual = (left: IExpression, right: IExpression) => {
      let leftReturnType = _.find(context.types, type => type.name === left.returnType);
      let rightReturnType = _.find(context.types, type => type.name === right.returnType);

      if (!leftReturnType)
        throw new Error(`Unkown type '${left.returnType}'.`);

      if (!rightReturnType)
        throw new Error(`Unkown type '${right.returnType}'.`);

      if (leftReturnType !== rightReturnType)
        throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

      let returnType = leftReturnType;
      let leftValue = this.visit(left, context);
      let rightValue = this.visit(right, context);

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

    let isIn = (left: IExpression, right: IExpression) => {
      let rightReturnType = right.returnType;

      if (rightReturnType !== 'List')
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
        throw new Error('Not supported.');
    }
  }

  visitConstant(expression: ConstantExpression, context: IInterpreterContext): any {
    return expression.value;
  }

  visitList(expression: ListExpression, context: IInterpreterContext): any {
    return expression.children.map(e => this.visit(e, context));
  }

  visitLocal(expression: LocalExpression, context: IInterpreterContext): any {
    return context.locals[expression.name];
  }

  visitMethodCall(expression: MethodCallExpression, context: IInterpreterContext): any {
    let targetValue = this.visit(expression.target, context);
    let argValues = expression.args.map(e => this.visit(e, context));

    return targetValue[expression.name].call(targetValue, argValues);
  }

  visitOr(expression: OrExpression, context: IInterpreterContext): any {
    for (let child of expression.children)
      if (this.visit(child, context))
        return true;

    return false;
  }

  visitProperty(expression: PropertyExpression, context: IInterpreterContext): any {
    let targetValue = this.visit(expression.target, context);

    return targetValue[expression.name];
  }
}
