import * as React from 'react';
import { KeyMaster, Key } from '../keymaster'
import { Nautilus, IMilestone, entityComparer } from '../nautilus';
import { Grid, GridHeaderRow, GridRow, GridHeaderCell, GridCell, IGridColumn } from './grid';
import { MilestoneField } from './milestone-field';
import { StateMilestoneField } from './milestone-field-state';
import { ProjectMilestoneField } from './milestone-field-project';
import { TitleMilestoneField } from './milestone-field-title';
import { SidMilestoneField } from './milestone-field-sid';
import config from '../config';

abstract class MilestoneFieldGridCell extends GridCell {
  private fieldElement: MilestoneField;
  protected Field: any;

  handleKeyDown(event: KeyboardEvent) {
    KeyMaster.handle(event, { which: Key.Enter }, null, this.handleKeyEnter.bind(this), true);
  }

  copyFrom(sourceCell: MilestoneFieldGridCell) {
    this.fieldElement.setValue(sourceCell.fieldElement.getValue());
  }

  private handleKeyEnter() {
    this.fieldElement.edit();
  }

  render() {
    var Field = this.Field;

    return <Field milestone={this.props.item} ref={(e: MilestoneField) => this.fieldElement = e} />;
  }
}

var SidGridColumn: IGridColumn = {
  key: 'sid',
  HeaderCell: class SidHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>#</span>;
    }
  },
  Cell: class SidFieldGridCell extends MilestoneFieldGridCell {
    protected Field = SidMilestoneField;
  }
}

var TitleGridColumn: IGridColumn = {
  key: 'title',
  HeaderCell: class TitleHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Title</span>;
    }
  },
  Cell: class TitleGridCell extends MilestoneFieldGridCell {
    protected Field = TitleMilestoneField;
  }
}

var ProjectGridColumn: IGridColumn = {
  key: 'project',
  HeaderCell: class PropertyHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Project</span>;
    }
  },
  Cell: class ProjectGridCell extends MilestoneFieldGridCell {
    protected Field = ProjectMilestoneField;
  }
}

var StateGridColumn: IGridColumn = {
  key: 'state',
  HeaderCell: class StateHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>State</span>;
    }
  },
  Cell: class StateGridCell extends MilestoneFieldGridCell {
    protected Field = StateMilestoneField;
  }
}

class MilestoneGridHeaderRow extends GridHeaderRow {
}

class MilestoneGridRow extends GridRow {
  static keyForItem(milestone: IMilestone) {
    return milestone.id;
  }
}

interface MilestoneGridProps {
  milestones?: IMilestone[];
  selectedMilestoneIndex?: number;
  onSelectionChange?(index: number): void;
}

export class MilestoneGrid extends React.Component<MilestoneGridProps, {}> {
  render() {
    return (
      <div className='milestone-list'>
        <Grid HeaderRow={MilestoneGridHeaderRow} Row={MilestoneGridRow} columns={[SidGridColumn, TitleGridColumn, ProjectGridColumn, StateGridColumn, ]} items={this.props.milestones} verticalOrder='reversed' selectedRowIndex={this.props.selectedMilestoneIndex} onRowSelectionChange={this.props.onSelectionChange.bind(this)} />
      </div>
    );
  }
};
