import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import Icon from '../icon';
import { IConfiguration } from './iconfiguration';

require('../../assets/stylesheets/base.less');
require('./configuration-list.less');

interface IConfigurationListProps {
  configurations: IConfiguration[];
  onDelete(configuration: IConfiguration): void;
  onSelect(configuration: IConfiguration): void;
}

interface IConfigurationListState {
  configurations?: IConfiguration[];
  selectedConfigurationIndex?: number;
  searchText?: string;
}

export default class ConfigurationList extends React.Component<IConfigurationListProps, IConfigurationListState> {
  constructor(props: IConfigurationListProps) {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleSaveSettingsDeleteClick = this.handleSaveSettingsDeleteClick.bind(this);
    this.handleSaveSettingsTitleClick = this.handleSaveSettingsTitleClick.bind(this);

    this.state = {
      configurations: props.configurations,
      selectedConfigurationIndex: 0,
    };
  }

  componentWillReceiveProps(props: IConfigurationListProps) {
    this.state = {
      configurations: props.configurations,
    };
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState({
        selectedConfigurationIndex: this.state.selectedConfigurationIndex < this.state.configurations.length - 1 ? this.state.selectedConfigurationIndex + 1 : 0,
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState({
        selectedConfigurationIndex: this.state.selectedConfigurationIndex > 0 ? this.state.selectedConfigurationIndex - 1 : this.state.configurations.length - 1,
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      const selectedConfiguration = this.state.configurations[this.state.selectedConfigurationIndex];

      this.props.onSelect(selectedConfiguration);
    }
  }

  private handleSearchTextChange(value: string) {
    this.setState({
      searchText: value,
      configurations: this.filterItems(this.props.configurations, value),
      selectedConfigurationIndex: 0,
    });
  }

  private handleSaveSettingsDeleteClick(configuration: IConfiguration) {
    this.props.onDelete(configuration);
  }

  private handleSaveSettingsTitleClick(configuration: IConfiguration) {
    this.props.onSelect(configuration);
  }

  private filterItems(configurations: IConfiguration[], text: string) {
    if (!text)
      return configurations;

    text = text.toLowerCase().trim();

    return configurations.filter(configuration => configuration.name.toLowerCase().indexOf(text) !== -1);
  }

  render() {
    return (
      <div className="configuration-list-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="configuration-list">
          {
            this.state.configurations.map((configuration, index) => {
              return (
                <div className={classNames('configuration', 'row', {'selected': index === this.state.selectedConfigurationIndex})} key={configuration.id}>
                  <a className="remove" href="#" onClick={_.partial(this.handleSaveSettingsDeleteClick, configuration)}>
                    <Icon name="remove" />
                  </a>
                  <a className="name" href="#" onClick={_.partial(this.handleSaveSettingsTitleClick, configuration)}>
                    {configuration.name}
                  </a>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
};
