import { Expression, IExpression } from '../expression'
import { OrExpression } from './or'

export class AndExpression extends Expression {
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
    }).join(' AND ');
  }
}
