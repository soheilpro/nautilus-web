import { Expression } from '../expression';

export class ConstantExpression extends Expression {
  constructor(public value: any, public type: string) {
    super();
  }

  returnType(): string {
    return this.type;
  }

  toString(): string {
    return JSON.stringify(this.value);
  }
}
