import * as React from 'react';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import Button from '../button';
import Dropdown from '../dropdown';
import PromptWindow from '../prompt-window';
import { IConfiguration } from './iconfiguration';
import { ISavedConfiguration } from './isaved-configuration';
import SavedConfigurationList from './saved-configuration-list';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IConfigurationManagerProps {
  currentConfiguration?: IConfiguration;
  savedConfigurations?: ISavedConfiguration[];
  onReset(): void;
  onSave(configuration: IConfiguration, name: string): void;
  onDelete(savedConfiguration: ISavedConfiguration): void;
  onSelect(savedConfiguration: ISavedConfiguration): void;
}

interface IConfigurationManagerState {
}

export default class ConfigurationManager extends React.Component<IConfigurationManagerProps, IConfigurationManagerState> {
  private windowController = ServiceManager.Instance.getWindowController();
  private dropdownComponent: Dropdown;
  private promptWindow: IWindow;

  constructor() {
    super();

    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleSavePromptWindowConfirm = this.handleSavePromptWindowConfirm.bind(this);
    this.handleSavePromptWindowCloseRequest = this.handleSavePromptWindowCloseRequest.bind(this);
    this.handleSavedConfigurationListDelete = this.handleSavedConfigurationListDelete.bind(this);
    this.handleSavedConfigurationListSelect = this.handleSavedConfigurationListSelect.bind(this);
  }

  private handleResetButtonClick() {
    this.props.onReset();
  }

  private handleSaveButtonClick() {
    this.promptWindow = {
      content: <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={this.handleSavePromptWindowConfirm} onCloseRequest={this.handleSavePromptWindowCloseRequest} />,
      top: 120,
      width: 500,
      modal: true,
    };

    this.windowController.showWindow(this.promptWindow);
  }

  private handleSavePromptWindowConfirm(value: string) {
    this.windowController.closeWindow(this.promptWindow);
    this.props.onSave(this.props.currentConfiguration, value);
  }

  private handleSavePromptWindowCloseRequest() {
    this.windowController.closeWindow(this.promptWindow);
  }

  private handleSavedConfigurationListDelete(savedConfiguration: ISavedConfiguration) {
    this.props.onDelete(savedConfiguration);
  }

  private handleSavedConfigurationListSelect(savedConfiguration: ISavedConfiguration) {
    this.dropdownComponent.close();
    this.props.onSelect(savedConfiguration);
  }

  render() {
    return (
      <div className="configuration-manager-component">
        {
          this.props.currentConfiguration &&
            <Button className="reset" type="secondary" onClick={this.handleResetButtonClick}>Reset</Button>
        }
        {
          this.props.currentConfiguration &&
            <Button className="save" type="secondary" onClick={this.handleSaveButtonClick}>Save</Button>
        }
        <Dropdown className="load" title="Load" ref={e => this.dropdownComponent = e}>
          <SavedConfigurationList savedConfigurations={this.props.savedConfigurations} onDelete={this.handleSavedConfigurationListDelete} onSelect={this.handleSavedConfigurationListSelect} />
        </Dropdown>
      </div>
    );
  }
};
