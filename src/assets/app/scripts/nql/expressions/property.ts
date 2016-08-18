import { Expression, IExpression } from '../expression'

export class PropertyExpression extends Expression {
  public target: Expression;
  public name: string;

  constructor(target: Expression, name: string) {
    super();

    this.target = target;
    this.name = name;
  }

  returnType(): string {
    return 'Any';
  }

  toString(): string {
    return `${this.target.toString()}.${this.name}`;
  }
}
