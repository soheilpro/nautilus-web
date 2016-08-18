import { Expression, IExpression } from '../expression'

export class MethodCallExpression extends Expression {
  public target: Expression;
  public name: string;
  public args: Expression[];

  constructor(target: Expression, name: string, args: Expression[]) {
    super();

    this.target = target;
    this.name = name;
    this.args = args;
  }

  returnType(): string {
    return 'Any';
  }

  toString(): string {
    return `${this.target.toString()}.${this.name}(${this.args.map(e => e.toString()).join(',')})`;
  }
}
