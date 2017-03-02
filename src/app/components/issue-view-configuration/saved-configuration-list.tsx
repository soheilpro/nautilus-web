import _ from 'underscore';
import React from 'react';
import classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./saved-configuration-list.less');

export interface ISavedConfiguration {
  id: string;
  name: string;
}

interface ISavedConfigurationListProps {
  savedConfigurations: ISavedConfiguration[];
  onDelete(savedConfiguration: ISavedConfiguration): void;
  onSelect(savedConfiguration: ISavedConfiguration): void;
}

interface ISavedConfigurationListState {
  savedConfigurations?: ISavedConfiguration[];
  selectedSavedConfigurationIndex?: number;
  searchText?: string;
}

export default class SavedConfigurationList extends React.Component<ISavedConfigurationListProps, ISavedConfigurationListState> {
  constructor(props: ISavedConfigurationListProps) {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleSaveSettingsDeleteClick = this.handleSaveSettingsDeleteClick.bind(this);
    this.handleSaveSettingsTitleClick = this.handleSaveSettingsTitleClick.bind(this);

    this.state = {
      savedConfigurations: props.savedConfigurations,
      selectedSavedConfigurationIndex: 0,
    };
  }

  componentWillReceiveProps(props: ISavedConfigurationListProps) {
    this.state = {
      savedConfigurations: props.savedConfigurations,
    };
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedSavedConfigurationIndex < this.state.savedConfigurations.length - 1) {
        this.setState({
          selectedSavedConfigurationIndex: this.state.selectedSavedConfigurationIndex + 1,
        });
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedSavedConfigurationIndex > 0) {
        this.setState({
          selectedSavedConfigurationIndex: this.state.selectedSavedConfigurationIndex - 1,
        });
      }
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      const selectedSavedConfiguration = this.state.savedConfigurations[this.state.selectedSavedConfigurationIndex];

      this.props.onSelect(selectedSavedConfiguration);
    }
  }

  private handleSearchTextChange(value: string) {
    this.setState({
      searchText: value,
      savedConfigurations: this.filterItems(this.props.savedConfigurations, value),
      selectedSavedConfigurationIndex: 0,
    });
  }

  private handleSaveSettingsDeleteClick(savedConfiguration: ISavedConfiguration) {
    this.props.onDelete(savedConfiguration);
  }

  private handleSaveSettingsTitleClick(savedConfiguration: ISavedConfiguration) {
    this.props.onSelect(savedConfiguration);
  }

  private filterItems(savedConfigurations: ISavedConfiguration[], text: string) {
    if (!text)
      return savedConfigurations;

    text = text.toLowerCase().trim();

    return savedConfigurations.filter(savedConfiguration => savedConfiguration.name.toLowerCase().indexOf(text) !== -1);
  }

  render() {
    return (
      <div className="saved-configuration-list-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="saved-configuration-list">
          {
            this.state.savedConfigurations.map((savedConfiguration, index) => {
              return (
                <div className={classNames('saved-configuration', 'row', {'selected': index === this.state.selectedSavedConfigurationIndex})} key={savedConfiguration.id}>
                  <a className="remove" href="#" onClick={_.partial(this.handleSaveSettingsDeleteClick, savedConfiguration)}>
                    <Icon name="remove" />
                  </a>
                  <a className="name" href="#" onClick={_.partial(this.handleSaveSettingsTitleClick, savedConfiguration)}>
                    {savedConfiguration.name}
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
