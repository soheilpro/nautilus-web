import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import Icon from '../icon';
import { ISavedConfiguration } from './isaved-configuration';

require('../../assets/stylesheets/base.less');
require('./saved-configuration-list.less');

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
    this.handleSaveConfigurationDeleteClick = this.handleSaveConfigurationDeleteClick.bind(this);
    this.handleSaveConfigurationTitleClick = this.handleSaveConfigurationTitleClick.bind(this);

    this.state = {
      savedConfigurations: props.savedConfigurations,
      selectedSavedConfigurationIndex: 0,
    };
  }

  componentWillReceiveProps(nextProps: ISavedConfigurationListProps) {
    this.state = {
      savedConfigurations: nextProps.savedConfigurations,
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

      let selectedSavedConfiguration = this.state.savedConfigurations[this.state.selectedSavedConfigurationIndex];

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

  private handleSaveConfigurationDeleteClick(savedConfiguration: ISavedConfiguration) {
    this.props.onDelete(savedConfiguration);
  }

  private handleSaveConfigurationTitleClick(savedConfiguration: ISavedConfiguration) {
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
        <div className="saved-configurations">
          {
            this.state.savedConfigurations.map((savedConfiguration, index) => {
              return (
                <div className={classNames('saved-configuration', 'row', {'selected': index === this.state.selectedSavedConfigurationIndex})} key={savedConfiguration.id}>
                  <a className="remove" href="#" title="Remove" onClick={_.partial(this.handleSaveConfigurationDeleteClick, savedConfiguration)}>
                    <Icon name="remove" />
                  </a>
                  <a className="name" href="#" onClick={_.partial(this.handleSaveConfigurationTitleClick, savedConfiguration)}>
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
