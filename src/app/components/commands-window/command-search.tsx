import * as React from 'react';
import Input from '../input';

require('../../assets/stylesheets/base.less');
require('./command-search.less');

interface ICommandSearchProps {
  autoFocus: boolean;
  onQueryChange(query: string): void;
}

interface ICommandSearchState {
  query?: string;
}

export default class CommandSearch extends React.Component<ICommandSearchProps, ICommandSearchState> {
  constructor() {
    super();

    this.handleQueryChange = this.handleQueryChange.bind(this);

    this.state = {};
  }

  private handleQueryChange(value: string) {
    this.props.onQueryChange(value);

    this.setState({
      query: value,
    });
  }

  render() {
    return (
      <div className="command-search-component">
        <Input className="query" placeholder="Search commands" value={this.state.query} autoFocus={this.props.autoFocus} onChange={this.handleQueryChange} />
      </div>
    );
  }
};
