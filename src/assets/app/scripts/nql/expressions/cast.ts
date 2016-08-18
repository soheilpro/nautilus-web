import { Expression, IExpression } from '../expression'
import { OrExpression } from './or'

export class CastExpression extends Expression {
  public child: Expression;
  public type: string;

  constructor(child: Expression, type: string) {
    super();

    this.child = child;
    this.type = type;
  }

  returnType(): string {
    return this.type;
  }

  toString(): string {
    return `(${this.type})(${this.child.toString()})`;
  }
}
