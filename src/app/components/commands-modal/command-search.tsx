import * as React from 'react';

require('./command-search.less');

interface ICommandSearchProps {
  onQueryChange(query: string): void;
}

interface ICommandSearchState {
  query?: string;
}

export default class CommandSearch extends React.Component<ICommandSearchProps, ICommandSearchState> {
  constructor() {
    super();

    this.handleQueryChange = this.handleQueryChange.bind(this);

    this.state = {
      query: '',
    };
  }

  private handleQueryChange(event: React.FormEvent<HTMLInputElement>) {
    let query = (event.target as HTMLInputElement).value;

    this.props.onQueryChange(query);

    this.setState({
      query: query,
    });
  }

  render() {
    return (
      <div className="command-search component">
        <input placeholder="Search commands" className="query" value={this.state.query} autoFocus={true} onChange={this.handleQueryChange} />
      </div>
    );
  }
};
