import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IIssueType, asEntity } from '../../application';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';

interface IIssueTypeFilterProps {
  onChange(query: NQL.IExpression): void;
}

interface IIssueTypeFilterState {
  issueTypes?: IIssueType[];
}

export default class IssueTypeFilter extends React.Component<IIssueTypeFilterProps, IIssueTypeFilterState> {
  private application = ServiceManager.Instance.getApplication();
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.state = {
      issueTypes: [],
    };
  }

  open() {
    this.listFilterComponent.open();
  }

  close() {
    this.listFilterComponent.close();
  }

  async componentDidMount() {
    this.setState({
      issueTypes: this.application.issueTypes.getAll(),
    });
  }

  render() {
    return (
      <ListFilter className="filter" title="Type" items={this.state.issueTypes} displayProperty="title" queryItem="type" queryItemType="IssueType" itemToQueryItem={asEntity} onChange={this.props.onChange} ref={e => this.listFilterComponent = e} />
    );
  }
};
