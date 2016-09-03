import * as React from 'react';
import { KeyMaster, Key } from '../keymaster'
import { Nautilus, IProject, entityComparer } from '../nautilus';
import { Grid, GridHeaderRow, GridRow, GridHeaderCell, GridCell, IGridColumn } from './grid';
import { ProjectField } from './project-field';
import { NameProjectField } from './project-field-name';
import config from '../config';

abstract class ProjectFieldGridCell extends GridCell {
  private fieldElement: ProjectField;
  protected Field: any;

  handleKeyDown(event: KeyboardEvent) {
    KeyMaster.handle(event, { which: Key.Enter }, null, this.handleKeyEnter.bind(this), true);
  }

  copyFrom(sourceCell: ProjectFieldGridCell) {
    this.fieldElement.setValue(sourceCell.fieldElement.getValue());
  }

  private handleKeyEnter() {
    this.fieldElement.edit();
  }

  render() {
    var Field = this.Field;

    return <Field project={this.props.item} ref={(e: ProjectField) => this.fieldElement = e} />;
  }
}

var NameGridColumn: IGridColumn = {
  key: 'name',
  HeaderCell: class NameHeaderGridCell extends GridHeaderCell {
    render() {
      return <span>Name</span>;
    }
  },
  Cell: class NameGridCell extends ProjectFieldGridCell {
    protected Field = NameProjectField;
  }
}

class ProjectGridHeaderRow extends GridHeaderRow {
}

class ProjectGridRow extends GridRow {
  static keyForItem(project: IProject) {
    return project.id;
  }
}

interface ProjectGridProps {
  projects?: IProject[];
  selectedProjectIndex?: number;
  onSelectionChange?(index: number): void;
}

export class ProjectGrid extends React.Component<ProjectGridProps, {}> {
  render() {
    return (
      <div className='project-list'>
        <Grid HeaderRow={ProjectGridHeaderRow} Row={ProjectGridRow} columns={[NameGridColumn]} items={this.props.projects} verticalOrder='reversed' selectedRowIndex={this.props.selectedProjectIndex} onRowSelectionChange={this.props.onSelectionChange.bind(this)} />
      </div>
    );
  }
};
