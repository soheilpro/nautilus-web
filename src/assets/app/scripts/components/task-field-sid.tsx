import * as React from 'react';
import { Nautilus } from '../nautilus';
import { TaskField } from './task-field';

export class SidTaskField extends TaskField {
  getValue(): string {
    return this.props.task.sid;
  }

  isEditable(): boolean {
    return false;
  }

  render() {
    var indents: JSX.Element[] = [];
    var parents = this.props.task.getParents();

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
