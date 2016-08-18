import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class TitleIssueField extends IssueField {
  getValue(): string {
    return this.props.issue.getTitle();
  }

  setValue(value: string): void {
    Nautilus.Instance.updateIssue(this.props.issue, { title: value });
  }

  render() {
    var indents: JSX.Element[] = [];
    var parents = this.props.issue.getParents();

    for (var i = 0; i < parents.length; i++)
      indents.push(<span className={classNames('indent', {'first': i === 0, 'last': i === parents.length - 1})}>&nbsp;</span>);

    return (
      <div>
        <div className='indents-container'>
          { indents }
        </div>
        <div className='editable-container'>
          { super.render() }
        </div>
      </div>
    );
  }
};
