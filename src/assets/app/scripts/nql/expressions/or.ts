import { Expression, IExpression } from '../expression'
import { AndExpression } from './and'

export class OrExpression extends Expression {
  public children: Expression[];

  constructor(children: Expression[]) {
    super();

    this.children = children;
  }

  returnType(): string {
    return 'Boolean';
  }

  toString(): string {
    return this.children.map(e => {
      if (e instanceof OrExpression)
        return `(${e.toString()})`;

      return e.toString()
    }).join(' OR ');
  }
}
