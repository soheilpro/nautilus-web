import * as React from 'react';
import { KeyMaster, Key } from '../keymaster'
import { Nautilus, IIssue, entityComparer } from '../nautilus';
import { Grid, GridHeaderRow, GridRow, GridHeaderCell, GridCell, IGridColumn } from './grid';
import { IssueField } from './issue-field';
import { AssignedUserIssueField } from './issue-field-assigned-user';
import { MilestoneIssueField } from './issue-field-milestone';
import { StateIssueField } from './issue-field-state';
import { TypeIssueField } from './issue-field-type';
import { PriorityIssueField } from './issue-field-priority';
import { ProjectIssueField } from './issue-field-project';
import { AreaIssueField } from './issue-field-area';
import { TitleIssueField } from './issue-field-title';
import { SidIssueField } from './issue-field-sid';
import config from '../config';

abstract class IssueFieldGridCell extends GridCell {
  private fieldElement: IssueField;
  protected Field: any;

  handleKeyDown(event: KeyboardEvent) {
    KeyMaster.handle(event, { which: Key.Enter }, null, this.handleKeyEnter.bind(this), true);
  }

  copyFrom(sourceCell: IssueFieldGridCell) {
    this.fieldElement.setValue(sourceCell.fieldElement.getValue());
  }

  private handleKeyEnter() {
    this.fieldElement.edit();
  }

  render() {
    var Field = this.Field;

    return <Field issue={this.props.item} ref={(e: IssueField) => this.fieldElement = e} />;
  }
}

var SidGridColumn: IGridColumn = {
  key: 'sid',
  HeaderCell: class SidHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>#</span>;
    }
  },
  Cell: class SidFieldGridCell extends IssueFieldGridCell {
    protected Field = SidIssueField;
  }
}

var MilestoneGridColumn: IGridColumn = {
  key: 'milestone',
  HeaderCell: class MilestoneHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Milestone</span>;
    }
  },
  Cell: class MilestoneGridCell extends IssueFieldGridCell {
    protected Field = MilestoneIssueField;
  }
}

var TitleGridColumn: IGridColumn = {
  key: 'title',
  HeaderCell: class TitleHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Title</span>;
    }
  },
  Cell: class TitleGridCell extends IssueFieldGridCell {
    protected Field = TitleIssueField;
  }
}

var ProjectGridColumn: IGridColumn = {
  key: 'project',
  HeaderCell: class PropertyHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Project</span>;
    }
  },
  Cell: class ProjectGridCell extends IssueFieldGridCell {
    protected Field = ProjectIssueField;
  }
}

var AreaGridColumn: IGridColumn = {
  key: 'area',
  HeaderCell: class AreaHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Area</span>;
    }
  },
  Cell: class AreaGridCell extends IssueFieldGridCell {
    protected Field = AreaIssueField;
  }
}

var TypeGridColumn: IGridColumn = {
  key: 'type',
  HeaderCell: class TypeHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Type</span>;
    }
  },
  Cell: class TypeGridCell extends IssueFieldGridCell {
    protected Field = TypeIssueField;
  }
}

var PriorityGridColumn: IGridColumn = {
  key: 'priority',
  HeaderCell: class PriorityHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Priority</span>;
    }
  },
  Cell: class PriorityGridCell extends IssueFieldGridCell {
    protected Field = PriorityIssueField;
  }
}

var StateGridColumn: IGridColumn = {
  key: 'state',
  HeaderCell: class StateHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>State</span>;
    }
  },
  Cell: class StateGridCell extends IssueFieldGridCell {
    protected Field = StateIssueField;
  }
}

var AssignedUserGridColumn: IGridColumn = {
  key: 'assignee',
  HeaderCell: class AssignedUserHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Assignee</span>;
    }
  },
  Cell: class AssignedUserGridCell extends IssueFieldGridCell {
    protected Field = AssignedUserIssueField;
  }
}

class IssueGridHeaderRow extends GridHeaderRow {
}

class IssueGridRow extends GridRow {
  static keyForItem(issue: IIssue) {
    return issue.id;
  }
}

interface IssueListProps {
  issues?: IIssue[];
  selectedIssueIndex?: number;
  onSelectionChange?(index: number): void;
}

export class IssueList extends React.Component<IssueListProps, {}> {
  handleRowDeletionRequest(issue: IIssue) {
    if (!window.confirm(`Delete issue #${issue.sid}?`))
      return;

    Nautilus.Instance.deleteIssue(issue);
  }

  render() {
    return (
      <div className='issue-list'>
        <Grid HeaderRow={IssueGridHeaderRow} Row={IssueGridRow} columns={[SidGridColumn, TitleGridColumn, ProjectGridColumn, TypeGridColumn, PriorityGridColumn, StateGridColumn, AssignedUserGridColumn, MilestoneGridColumn]} items={this.props.issues} horizontalDirection={config.rtl ? 'rightToLeft' : 'leftToRight'} verticalOrder='reversed' selectedRowIndex={this.props.selectedIssueIndex} onRowSelectionChange={this.props.onSelectionChange.bind(this)} onRowDeletionRequest={this.handleRowDeletionRequest.bind(this)} />
      </div>
    );
  }
};
