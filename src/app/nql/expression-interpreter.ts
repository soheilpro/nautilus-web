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
import * as _ from 'underscore';
import TypeSystem from './type-system';

interface ILocals {
  [key: string]: any;
}

export interface IInterpretationContext {
  locals: ILocals;
}

export class ExpressionInterpreter extends ExpressionVisitor<any, IInterpretationContext> {
  private typeSystem = new TypeSystem();

  constructor(types: IType[]) {
    super();

    this.typeSystem.registerTypes(types);
  }

  evaluate(expression: IExpression, locals: ILocals): Function {
    let context: IInterpretationContext = {
      locals
    };

    return this.visit(expression, context);
  }

  visitAnd(expression: AndExpression, context: IInterpretationContext): any {
    for (let child of expression.children)
      if (!this.visit(child, context))
        return false;

    return true;
  }

  visitCast(expression: CastExpression, context: IInterpretationContext): any {
    return this.visit(expression.child, context);
  }

  visitComparison(expression: ComparisonExpression, context: IInterpretationContext): any {
    let areEqual = (left: IExpression, right: IExpression) => {
      let leftReturnType = this.typeSystem.get(expression.left.returnType);
      let rightReturnType = this.typeSystem.get(expression.right.returnType);

      if (!leftReturnType)
        throw new Error(`Unkown type '${left.returnType}'.`);

      if (!rightReturnType)
        throw new Error(`Unkown type '${right.returnType}'.`);

      let commonReturnType = this.typeSystem.getCommonType(leftReturnType, rightReturnType);

      if (!commonReturnType)
        throw new Error(`Cannot compare expressions of type '${leftReturnType}' and '${rightReturnType}'.`);

      let leftValue = this.visit(expression.left, context);
      let rightValue = this.visit(expression.right, context);

      if (commonReturnType.name === 'Boolean')
        return leftValue === rightValue;

      if (commonReturnType.name === 'Number')
        return leftValue === rightValue;

      if (commonReturnType.name === 'String')
        return leftValue === rightValue;

      let entityType = this.typeSystem.get('Entity');

      if (this.typeSystem.isOfType(commonReturnType, entityType))
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

  visitConstant(expression: ConstantExpression, context: IInterpretationContext): any {
    return expression.value;
  }

  visitList(expression: ListExpression, context: IInterpretationContext): any {
    return expression.children.map(e => this.visit(e, context));
  }

  visitLocal(expression: LocalExpression, context: IInterpretationContext): any {
    return context.locals[expression.name];
  }

  visitMethodCall(expression: MethodCallExpression, context: IInterpretationContext): any {
    let targetValue = this.visit(expression.target, context);
    let argValues = expression.args.map(e => this.visit(e, context));

    return targetValue[expression.name].call(targetValue, argValues);
  }

  visitOr(expression: OrExpression, context: IInterpretationContext): any {
    for (let child of expression.children)
      if (this.visit(child, context))
        return true;

    return false;
  }

  visitProperty(expression: PropertyExpression, context: IInterpretationContext): any {
    let targetValue = this.visit(expression.target, context);

    return targetValue[expression.name];
  }
}
