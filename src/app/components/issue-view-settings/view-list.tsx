import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import Icon from '../icon';
import { IView } from './iview';

require('../../assets/stylesheets/base.less');
require('./view-list.less');

interface IViewListProps {
  views: IView[];
  onDelete(view: IView): void;
  onSelect(view: IView): void;
}

interface IViewListState {
  views?: IView[];
  selectedViewIndex?: number;
  searchText?: string;
}

export default class ViewList extends React.Component<IViewListProps, IViewListState> {
  constructor(props: IViewListProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleViewMouseEnter = this.handleViewMouseEnter.bind(this);
    this.handleViewDeleteClick = this.handleViewDeleteClick.bind(this);
    this.handleViewTitleClick = this.handleViewTitleClick.bind(this);

    this.state = {
      views: props.views,
      selectedViewIndex: 0,
    };
  }

  componentWillReceiveProps(props: IViewListProps) {
    this.setState({
      views: props.views,
    });
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState({
        selectedViewIndex: this.state.selectedViewIndex < this.state.views.length - 1 ? this.state.selectedViewIndex + 1 : 0,
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState({
        selectedViewIndex: this.state.selectedViewIndex > 0 ? this.state.selectedViewIndex - 1 : this.state.views.length - 1,
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      const selectedView = this.state.views[this.state.selectedViewIndex];

      this.props.onSelect(selectedView);
    }
  }

  private handleSearchTextChange(value: string) {
    this.setState({
      searchText: value,
      views: this.filterItems(this.props.views, value),
      selectedViewIndex: 0,
    });
  }

  private handleViewMouseEnter(view: IView) {
    this.setState({
      selectedViewIndex: this.state.views.indexOf(view),
    });
  }

  private handleViewDeleteClick(view: IView, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.props.onDelete(view);
  }

  private handleViewTitleClick(view: IView, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.props.onSelect(view);
  }

  private filterItems(views: IView[], text: string) {
    if (!text)
      return views;

    text = text.toLowerCase().trim();

    return views.filter(view => view.name.toLowerCase().indexOf(text) !== -1);
  }

  render() {
    return (
      <div className="view-list-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="view-list">
          {
            this.state.views.length > 0 ?
              this.state.views.map((view, index) => {
                return (
                  <div className={classNames('view', 'row', {'selected': index === this.state.selectedViewIndex})} onMouseEnter={_.partial(this.handleViewMouseEnter, view)} key={view.id}>
                    <a className="remove" href="#" title="Remove" onClick={_.partial(this.handleViewDeleteClick, view)}>
                      <Icon name="remove" />
                    </a>
                    <a className="name" href="#" onClick={_.partial(this.handleViewTitleClick, view)}>
                      {view.name}
                    </a>
                  </div>
                );
              })
              :
              <div className="no-views-found">
                  No saved views found.
              </div>
          }
        </div>
      </div>
    );
  }
};
