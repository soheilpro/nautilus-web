import * as React from 'react';
import { Nautilus, IItem, IIssue, entityComparer } from '../nautilus';
import { KeyMaster, Key } from '../keymaster'
import { Grid, GridHeaderRow, GridRow, GridHeaderCell, GridCell, IGridColumn } from './grid';
import { IssueField } from './issue-field';
import { MilestoneIssueField } from './issue-field-milestone';
import { StateIssueField } from './issue-field-state';
import { TypeIssueField } from './issue-field-type';
import { ProjectIssueField } from './issue-field-project';
import { TitleIssueField } from './issue-field-title';
import { SidIssueField } from './issue-field-sid';
import { SidTaskField } from './task-field-sid';
import { TitleTaskField } from './task-field-title';
import { TypeTaskField } from './task-field-type';
import { StateTaskField } from './task-field-state';
import { AssignedToTaskField } from './task-field-assigned-to';
import config from '../config';

abstract class ItemFieldGridCell extends GridCell {
  private fieldElement: IssueField;
  protected Field: any;

  handleKeyDown(event: KeyboardEvent) {
    KeyMaster.handle(event, { which: Key.Enter }, null, this.handleKeyEnter.bind(this), true);
  }

  copyFrom(sourceCell: ItemFieldGridCell) {
    var sourceCellValue = sourceCell.fieldElement.getValue();
    var destinationCellValue = this.fieldElement.getValue();

    if (sourceCellValue !== undefined && destinationCellValue === undefined)
      this.fieldElement.setValue(sourceCell.fieldElement.getValue());
  }

  private handleKeyEnter() {
    this.fieldElement.edit();
  }

  render() {
    var Field = this.Field;

    return <Field issue={this.props.item} task={this.props.item} ref={(e: IssueField) => this.fieldElement = e} />;
  }
}

var SidGridColumn: IGridColumn = {
  key: 'sid',
  getHeaderCell() {
    return class SidHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>#</span>;
      }
    };
  },
  getCell(item: IItem) {
    if (item.kind === 'issue')
      return class SidFieldGridCell extends ItemFieldGridCell {
        protected Field = SidIssueField;
      };

    if (item.kind === 'task')
      return class SidFieldGridCell extends ItemFieldGridCell {
        protected Field = SidTaskField;
      };

    throw new Error('Not supported');
  }
}

var MilestoneGridColumn: IGridColumn = {
  key: 'milestone',
  getHeaderCell() {
    return class MilestoneHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>Milestone</span>;
      }
    };
  },
  getCell(item: any) {
    if (item.kind === 'issue')
      return class MilestoneGridCell extends ItemFieldGridCell {
        protected Field = MilestoneIssueField;
      };

    if (item.kind === 'task')
      return class MilestoneGridCell extends GridCell {
        render() {
          return <span></span>;
        }
      };

    throw new Error('Not supported');
  }
}

var TitleGridColumn: IGridColumn = {
  key: 'title',
  getHeaderCell() {
    return class TitleHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>Title</span>;
      }
    };
  },
  getCell(item: IItem) {
    if (item.kind === 'issue')
      return class TitleGridCell extends ItemFieldGridCell {
        protected Field = TitleIssueField;
      };

    if (item.kind === 'task')
      return class TitleGridCell extends ItemFieldGridCell {
        protected Field = TitleTaskField;
      };

    throw new Error('Not supported');
  }
}

var ProjectGridColumn: IGridColumn = {
  key: 'project',
  getHeaderCell() {
    return class PropertyHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>Project</span>;
      }
    };
  },
  getCell(item: IItem) {
    if (item.kind === 'issue')
      return class ProjectGridCell extends ItemFieldGridCell {
        protected Field = ProjectIssueField;
      };

    if (item.kind === 'task')
      return class ProjectGridCell extends GridCell {
        render() {
          return <span></span>;
        }
      };

    throw new Error('Not supported');
  }
}

var TypeGridColumn: IGridColumn = {
  key: 'type',
  getHeaderCell() {
    return class TypeHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>Type</span>;
      }
    };
  },
  getCell(item: IItem) {
    if (item.kind === 'issue')
      return class TypeGridCell extends ItemFieldGridCell {
        protected Field = TypeIssueField;
      };

    if (item.kind === 'task')
      return class TypeGridCell extends ItemFieldGridCell {
        protected Field = TypeTaskField;
      };

    throw new Error('Not supported');
  }
}

var StateGridColumn: IGridColumn = {
  key: 'state',
  getHeaderCell() {
    return class StateHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>State</span>;
      }
    };
  },
  getCell(item: IItem) {
    if (item.kind === 'issue')
      return class StateGridCell extends ItemFieldGridCell {
        protected Field = StateIssueField;
      };

    if (item.kind === 'task')
      return class StateGridCell extends ItemFieldGridCell {
        protected Field = StateTaskField;
      };

    throw new Error('Not supported');
  }
}

var AssignedToGridColumn: IGridColumn = {
  key: 'assignedTo',
  getHeaderCell() {
    return class AssignedToHeaderGridCell extends GridHeaderCell {
      render() {
        return <span>Assigned To</span>;
      }
    };
  },
  getCell(item: IItem) {
    if (item.kind === 'issue')
      return class AssignedToGridCell extends GridCell {
        render() {
          return <span></span>;
        }
      };

    if (item.kind === 'task')
      return class AssignedToGridCell extends ItemFieldGridCell {
        protected Field = AssignedToTaskField;
      };

    throw new Error('Not supported');
  }
}

class IssueGridHeaderRow extends GridHeaderRow {
}

class IssueGridRow extends GridRow {
  static keyForItem(issue: IIssue) {
    return issue.id;
  }

  getTRClassName() {
    var issue = this.props.item as IIssue;
    var className: string[] = [];

    var type = issue.getType();
    if (type)
      className.push("type-" + type.key.replace(':', '-'));

    var priority = issue.getPriority();
    if (priority)
      className.push("priority-" + priority.key.replace(':', '-'));

    var state = issue.getState();
    if (state)
      className.push("state-" + state.key);

    return classNames(super.getTRClassName(), className.join(' '));
  }
}

interface IssueGridProps {
  issues?: IIssue[];
  selectedIssueIndex?: number;
  onSelectionChange?(index: number): void;
}

export class IssueGrid extends React.Component<IssueGridProps, {}> {
  handleRowDeletionRequest(issue: IIssue) {
    if (!window.confirm(`Delete issue #${issue.sid}?`))
      return;

    Nautilus.Instance.deleteIssue(issue);
  }

  render() {
    return (
      <div className='issue-list'>
        <Grid HeaderRow={IssueGridHeaderRow} Row={IssueGridRow} columns={[SidGridColumn, TypeGridColumn, TitleGridColumn, ProjectGridColumn, MilestoneGridColumn, StateGridColumn, AssignedToGridColumn]} items={this.props.issues} horizontalDirection={config.rtl ? 'rightToLeft' : 'leftToRight'} verticalOrder='reversed' selectedRowIndex={this.props.selectedIssueIndex} onRowSelectionChange={this.props.onSelectionChange.bind(this)} onRowDeletionRequest={this.handleRowDeletionRequest.bind(this)} />
      </div>
    );
  }
};
