import { Expression, IExpression } from '../expression'

export class LocalExpression extends Expression {
  public name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }

  returnType(): string {
    return 'Any';
  }

  toString(): string {
    return this.name;
  }
}
