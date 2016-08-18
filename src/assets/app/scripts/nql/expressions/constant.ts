import { Expression, IExpression } from '../expression'

export class ConstantExpression extends Expression {
  public value: any;
  public type: string;

  constructor(value: any, type: string) {
    super();

    this.value = value;
    this.type = type;
  }

  returnType(): string {
    return this.type;
  }

  toString(): string {
    return JSON.stringify(this.value);
  }
}
