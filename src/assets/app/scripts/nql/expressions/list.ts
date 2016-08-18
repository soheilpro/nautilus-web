import { Expression, IExpression } from '../expression'

export class ListExpression extends Expression {
  public children: Expression[];

  constructor(children: Expression[]) {
    super();

    this.children = children;
  }

  returnType(): string {
    return 'List';
  }

  toString(): string {
    return `[${this.children.map(e => e.toString()).join(', ')}]`;
  }
}
