import { Nautilus, IIssue, ITask } from './nautilus';
import * as NQL from './nql/nql'

class QueryNormalizer extends NQL.ExpressionTransformer<{}> {
  visitComparison(expression: NQL.ComparisonExpression, context: {}): NQL.IExpression {
    var left = expression.left;
    var right = expression.right;

    interface IMapping {
      [key: string]: {
        function: string;
        valueToObject: (value: string) => Object;
        type: string;
      }
    };

    var mapping: IMapping = {
      'milestone': {
        function: 'getMilestone',
        valueToObject: (value: string) => Nautilus.Instance.getMilestoneByTitle(value),
        type: 'Milestone'
      },
      'project': {
        function: 'getProject',
        valueToObject: (value: string) => Nautilus.Instance.getProjectByName(value),
        type: 'Project'
      },
      'type': {
        function: 'getType',
        valueToObject: (value: string) => Nautilus.Instance.getIssueTypeByTitle(value),
        type: 'ItemType'
      },
      'priority': {
        function: 'getPriority',
        valueToObject: (value: string) => Nautilus.Instance.getItemPriorityByTitle(value),
        type: 'ItemPriority'
      },
      'state': {
        function: 'getState',
        valueToObject: (value: string) => Nautilus.Instance.getItemStateByTitle(value),
        type: 'ItemState'
      },
      'assignedTo': {
        function: 'getAssignedTo',
        valueToObject: (value: string) => Nautilus.Instance.getUserByName(value),
        type: 'User'
      },
      'createdBy': {
        function: 'getCreatedBy',
        valueToObject: (value: string) => Nautilus.Instance.getUserByName(value),
        type: 'User'
      }
    };

    if (left instanceof NQL.LocalExpression) {
      var map = mapping[(left as NQL.LocalExpression).name];

      left = new NQL.CastExpression(new NQL.MethodCallExpression(new NQL.LocalExpression('this'), map.function, []), map.type);

      if (right instanceof NQL.ConstantExpression) {
        right = this.getExpression(right, map.valueToObject, map.type);
      }
      else if (right instanceof NQL.ListExpression) {
        var children = (right as NQL.ListExpression).children;

        right = new NQL.ListExpression(children.map(e => this.getExpression(e, map.valueToObject, map.type)));
      }
    }

    return new NQL.ComparisonExpression(this.visit(left, context), this.visit(right, context), expression.operator);
  }

  private getExpression(expression: NQL.IExpression, valueToObject: (value: string) => Object, type: string): NQL.IExpression {
    if (expression instanceof NQL.ConstantExpression) {
      if (expression.type === 'String') {
        var value = (expression as NQL.ConstantExpression).value;
        var object = valueToObject(value);

        return new NQL.ConstantExpression(object, type);
      }

      return expression;
    }

    throw new Error('Not Implemented');
  }
}

export class Query {
  static evaluateIssueFilter(query: NQL.IExpression, issue: IIssue): boolean {
    var normalizedQuery = new QueryNormalizer().tranform(query, null);

    var context: NQL.IEvaluationContext = {
      types: [
        {
          name: 'Milestone',
          base: 'Entity'
        },
        {
          name: 'Project',
          base: 'Entity'
        },
        {
          name: 'ItemType',
          base: 'Entity'
        },
        {
          name: 'ItemPriority',
          base: 'Entity'
        },
        {
          name: 'ItemState',
          base: 'Entity'
        },
        {
          name: 'User',
          base: 'Entity'
        }
      ],
      locals: {
        this: issue
      }
    };

    return new NQL.ExpressionEvaluator().evaluate(normalizedQuery, context);
  }

  static evaluateTaskFilter(query: NQL.IExpression, task: ITask): boolean {
    var normalizedQuery = new QueryNormalizer().tranform(query, null);

    var context: NQL.IEvaluationContext = {
      types: [
        {
          name: 'Milestone',
          base: 'Entity'
        },
        {
          name: 'Project',
          base: 'Entity'
        },
        {
          name: 'ItemType',
          base: 'Entity'
        },
        {
          name: 'ItemPriority',
          base: 'Entity'
        },
        {
          name: 'ItemState',
          base: 'Entity'
        },
        {
          name: 'User',
          base: 'Entity'
        }
      ],
      locals: {
        this: task
      }
    };

    return new NQL.ExpressionEvaluator().evaluate(normalizedQuery, context);
  }
}
