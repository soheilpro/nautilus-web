import { Expression, IExpression } from '../expression'

export class ComparisonExpression extends Expression {
  public left: Expression;
  public right: Expression;
  public operator: string;

  constructor(left: Expression, right: Expression, operator: string) {
    super();

    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  returnType(): string {
    return 'Boolean';
  }

  toString(): string {
    return `${this.left.toString()} ${this.operator} ${this.right.toString()}`
  }
}
