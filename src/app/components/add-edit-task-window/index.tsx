import * as React from 'react';
import { IItemState, IItemType, ITask, ITaskChange, IUser } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Input from '../input';
import ItemTypeSelect from '../item-type-select';
import ItemStateSelect from '../item-state-select';
import UserSelect from '../user-select';
import Button from '../button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditTaskWindowProps {
  mode: 'add' | 'edit';
  task?: ITask;
  onAdd?(task: ITask): void;
  onUpdate?(taskChange: ITaskChange): void;
  onCloseRequest(): void;
}

interface IAddEditTaskWindowState {
  title?: string;
  type?: IItemType;
  state?: IItemState;
  assignedTo?: IUser;
  description?: string;
}

export default class AddEditTaskWindow extends React.PureComponent<IAddEditTaskWindowProps, IAddEditTaskWindowState> {
  constructor(props: IAddEditTaskWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleTypeInputChange = this.handleTypeInputChange.bind(this);
    this.handleStateInputChange = this.handleStateInputChange.bind(this);
    this.handleAssignedToInputChange = this.handleAssignedToInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);

    this.state = {};

    if (props.task) {
      this.state.title = props.task.title;
      this.state.type = props.task.type;
      this.state.state = props.task.state;
      this.state.assignedTo = props.task.assignedTo;
      this.state.description = props.task.description;
    }
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const task: ITask = {
          type: this.state.type,
          title: this.state.title,
          description: this.state.description,
          state: this.state.state,
          assignedTo: this.state.assignedTo,
        };

        this.props.onAdd(task);
        break;

      case 'edit':
        const taskChange: ITaskChange = {
          type: this.state.type || null,
          title: this.state.title,
          description: this.state.description,
          state: this.state.state || null,
          assignedTo: this.state.assignedTo || null,
        };

        this.props.onUpdate(taskChange);
        break;
    }
  }

  private handleTitleInputChange(value: string) {
    this.setState({
      title: value,
    });
  }

  private handleTypeInputChange(value: IItemType) {
    this.setState({
      type: value,
    });
  }

  private handleStateInputChange(value: IItemState) {
    this.setState({
      state: value,
    });
  }

  private handleAssignedToInputChange(value: IItemState) {
    this.setState({
      assignedTo: value,
    });
  }

  private handleDescriptionInputChange(value: string) {
    this.setState({
      description: value,
    });
  }

  render() {
    return (
      <Window className="add-edit-task-window-component">
        <WindowHeader>
          { this.props.mode === 'add' && 'New Task' }
          { this.props.mode === 'edit' && `Edit Task #${this.props.task.sid}` }
        </WindowHeader>
        <WindowContent>
          <form className="form" id="addEditTaskForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                Title:
              </div>
              <div className="value">
                <Input className="title" value={this.state.title} autoFocus={true} selectOnFocus={true} onChange={this.handleTitleInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Type:
              </div>
              <div className="value">
                <ItemTypeSelect className="type" itemKind="task" itemType={this.state.type} onChange={this.handleTypeInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                State:
              </div>
              <div className="value">
                <ItemStateSelect className="state" itemKind="task" itemState={this.state.state} onChange={this.handleStateInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Assigned To:
              </div>
              <div className="value">
                <UserSelect className="assigned-to-state" user={this.state.assignedTo} onChange={this.handleAssignedToInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Description:
              </div>
              <div className="value">
                <Input className="description" value={this.state.description} multiline={true} selectOnFocus={true} onChange={this.handleDescriptionInputChange} />
              </div>
            </div>
          </form>
        </WindowContent>
        <WindowActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditTaskForm">Add Task</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditTaskForm">Update Task</Button>
          }
        </WindowActionBar>
      </Window>
    );
  }
};
