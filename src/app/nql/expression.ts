export interface IExpression {
  returnType(): string;
}

export abstract class Expression implements IExpression {
  abstract returnType(): string;
}
