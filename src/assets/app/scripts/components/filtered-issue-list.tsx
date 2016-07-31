import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueList } from './issue-list';

interface FilteredIssueListProps {
  filters;
}

export class FilteredIssueList extends React.Component<FilteredIssueListProps, {}> {
  componentDidMount() {
    Nautilus.Instance.on('issueAdded', () => {
      this.forceUpdate();
    });

    Nautilus.Instance.on('issueChanged', () => {
      this.forceUpdate();
    });

    Nautilus.Instance.on('issueDeleted', () => {
      this.forceUpdate();
    });
  }

  filterIssues(issues) {
     function filter(issues, filterItems, valueGetter, include) {
      if (filterItems.length == 0)
        return issues;

      return _.filter(issues, (issue) => {
        var value = issue[valueGetter]();

        return _.some(filterItems, (filterItem) => {
          return value && value.id === (filterItem as any).id;
        }) == include;
      });
    }

    issues = filter(issues, this.props.filters.milestones.include.items, 'getMilestone', true);
    issues = filter(issues, this.props.filters.milestones.exclude.items, 'getMilestone', false);
    issues = filter(issues, this.props.filters.states.include.items, 'getState', true);
    issues = filter(issues, this.props.filters.states.exclude.items, 'getState', false);
    issues = filter(issues, this.props.filters.assignedUsers.include.items, 'getAssignedUser', true);
    issues = filter(issues, this.props.filters.assignedUsers.exclude.items, 'getAssignedUser', false);
    issues = filter(issues, this.props.filters.projects.include.items, 'getProject', true);
    issues = filter(issues, this.props.filters.projects.exclude.items, 'getProject', false);

    return issues;
  }

  render() {
    return (
      <IssueList issues={this.filterIssues(Nautilus.Instance.getIssues())} />
    );
  }
};
