import * as React from 'react';
import { IActionController } from '../../actions';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import UndoLastActionCommand from './undo-last-action-command';

interface IActionControllerProps {
}

interface IActionControllerState {
}

export default class ActionController extends React.Component<IActionControllerProps, IActionControllerState> implements IActionController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();

  componentWillMount() {
    ServiceManager.Instance.setActionController(this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setActionController(undefined);
  }

  getCommands() {
    return [
      new UndoLastActionCommand(),
    ];
  }


  render() {
    return (
      <div className="action-controller-component">
      </div>
    );
  }
};
