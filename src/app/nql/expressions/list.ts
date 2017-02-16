import { Expression } from '../expression';

export class ListExpression extends Expression {
  constructor(public children: Expression[]) {
    super();
  }

  returnType(): string {
    return 'List';
  }

  toString(): string {
    return `[${this.children.map(e => e.toString()).join(', ')}]`;
  }
}
