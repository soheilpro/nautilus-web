var FilterBox = React.createClass({
  onItemSelected: function(item) {
    this.props.filters.clear();
    this.props.filter.include.set(item);
    this.props.onChanged();
  },
  onItemIncluded: function(item, event) {
    this.props.filter.include.toggle(item, event.target.checked);
    this.props.onChanged();
  },
  onItemExcluded: function(item, event) {
    this.props.filter.exclude.toggle(item, event.target.checked);
    this.props.onChanged();
  },
  render: function() {
    return (
      <div>
        <label>{this.props.name}</label>
        {
          this.props.items.map(function(item) {
            return (
              <div className='filter' key={item.id}>
                <input type='checkbox' checked={this.props.filter.exclude.has(item)} onChange={this.onItemExcluded.bind(this, item)} className={this.props.filter.exclude.has(item) ? 'visible' : ''} />
                <input type='checkbox' checked={this.props.filter.include.has(item)} onChange={this.onItemIncluded.bind(this, item)} className={this.props.filter.include.has(item) ? 'visible' : ''} />
                <a href='#' onClick={this.onItemSelected.bind(this, item)}>{item[this.props.displayAttribute]}</a>
              </div>
            )
          }, this)
        }
      <br />
      </div>
    );
  }
});

var Editable = React.createClass({
  onKeyDown: function(event) {
    if (event.which !== 27)
      return;

    this.endEditing();
  },
  onKeyPress: function(event) {
    if (event.which !== 13)
      return;

    //- if (this.focused)
    //-   return;

    var item = $(this.inputElement).val();

    if (this.props.items)
      item = this.props.itemFromString(item, this.props.items);

    this.onItemChanged(item);
    this.endEditing();
  },
  startEditing: function() {
    this.focused = false;

    $(this.containerElement).addClass('editing');

    $(this.inputElement)
      .css({'min-width': $(this.spanElement).width()})
      .val(this.props.itemToString(this.props.item))
      .select()
      .focus();

    if (this.props.items) {
      $(this.inputElement)
        .autocomplete({
          source: _.map(this.props.items, this.props.itemToString),
          delay: 0,
          minLength: 0,
          focus: function(event, ui) {
            this.focused = true;
          }.bind(this),
          select: function(event, ui) {
            var item = this.props.itemFromString(ui.item.value, this.props.items);
            this.onItemChanged(item);
            this.endEditing();
          }.bind(this)
        })
        .autocomplete('search', '');
    }
  },
  endEditing: function() {
    $(this.containerElement).parent().focus();
    $(this.containerElement).removeClass('editing');
  },
  onItemChanged: function(item) {
    if (this.props.itemComparer(item, this.props.item))
      return;

    this.props.onItemChanged(item);
  },
  render: function() {
    return (
      <div className='editable' onDoubleClick={this.startEditing} ref={(ref) => this.containerElement = ref}>
        <span style={this.props.spanStyle} ref={(ref) => this.spanElement = ref}>{this.props.itemToString(this.props.item)}</span>
        <input style={this.props.inputStyle} onKeyDown={this.onKeyDown} onKeyPress={this.onKeyPress} onBlur={this.endEditing} ref={(ref) => this.inputElement = ref} />
      </div>
    );
  }
});

var IssueProject = React.createClass({
  comparer: function(value1, value2) {
    if (!value1 || !value2)
      return false;

    return value1.id === value2.id;
  },
  itemToString: function(item) {
    return item ? item.name : '';
  },
  itemFromString: function(value, items) {
    return _.find(items, { name: value });
  },
  onChanged: function(value) {
    nautilus.updateIssue(this.props.issue, { project: value });
  },
  edit: function() {
    this.refs.editable.startEditing();
  },
  render: function() {
    return (
      <Editable item={this.props.issue.getProject()} items={nautilus.getProjects()} itemToString={this.itemToString} itemFromString={this.itemFromString} itemComparer={this.comparer} onItemChanged={this.onChanged} ref='editable' />
    );
  }
});

var IssueMilestone = React.createClass({
  comparer: function(value1, value2) {
    if (!value1 || !value2)
      return false;

    return value1.id === value2.id;
  },
  itemToString: function(item) {
    return item ? item.title : '';
  },
  itemFromString: function(value, items) {
    return _.find(items, { title: value });
  },
  onChanged: function(value) {
    nautilus.updateIssueMilestone(this.props.issue, value);
  },
  edit: function() {
    this.refs.editable.startEditing();
  },
  render: function() {
    return (
      <Editable item={this.props.issue.getMilestone()} items={nautilus.getMilestones()} itemToString={this.itemToString} itemFromString={this.itemFromString} itemComparer={this.comparer} onItemChanged={this.onChanged} ref='editable' />
    );
  }
});

var IssueState = React.createClass({
  comparer: function(value1, value2) {
    if (!value1 || !value2)
      return false;

    return value1.id === value2.id;
  },
  itemToString: function(item) {
    return item ? item.title : '';
  },
  itemFromString: function(value, items) {
    return _.find(items, { title: value });
  },
  onChanged: function(value) {
    nautilus.updateIssue(this.props.issue, { state: value });
  },
  edit: function() {
    this.refs.editable.startEditing();
  },
  render: function() {
    return (
      <Editable item={this.props.issue.getState()} items={nautilus.getStates()} itemToString={this.itemToString} itemFromString={this.itemFromString} itemComparer={this.comparer} onItemChanged={this.onChanged} ref='editable' />
    );
  }
});

var IssueTitle = React.createClass({
  comparer: function(value1, value2) {
    return value1 === value2;
  },
  onChanged: function(value) {
    nautilus.updateIssue(this.props.issue, { title: value });
  },
  edit: function() {
    this.refs.editable.startEditing();
  },
  getEditableSpanStyle: function() {
    var state = this.props.issue.getState();

    if (!state)
      return;

    return {
      backgroundColor: state.color
    };
  },
  render: function() {
    return (
      <Editable item={this.props.issue.title} itemToString={_.identity} itemComparer={this.comparer} onItemChanged={this.onChanged} spanStyle={this.getEditableSpanStyle()} ref='editable' />
    );
  }
});

var IssueAssignedUser = React.createClass({
  comparer: function(value1, value2) {
    if (!value1 || !value2)
      return false;

    return value1.id === value2.id;
  },
  itemToString: function(item) {
    return item ? item.name : '';
  },
  itemFromString: function(value, items) {
    return _.find(items, { name: value });
  },
  onChanged: function(value) {
    nautilus.updateIssue(this.props.issue, { assignedUser: value });
  },
  edit: function() {
    this.refs.editable.startEditing();
  },
  render: function() {
    return (
      <Editable item={this.props.issue.getAssignedUser()} items={nautilus.getUsers()} itemToString={this.itemToString} itemFromString={this.itemFromString} itemComparer={this.comparer} onItemChanged={this.onChanged} ref='editable' />
    );
  }
});

var IssueList = React.createClass({
  getInitialState: function() {
    return {
      selectedRowIndex: 0,
      selectedColumnIndex: 0
    };
  },
  onKeyDown: function(event) {
    if (event.target !== event.currentTarget)
      return;

    switch (event.which) {
      case 38: // Up
        if (this.state.selectedRowIndex === 0)
          return;

        this.setState({
          selectedRowIndex: this.state.selectedRowIndex - 1
        });

        event.preventDefault();
        break;

      case 40: // Down
        if (this.state.selectedRowIndex === this.props.issues.length - 1)
          return;

        this.setState({
          selectedRowIndex: this.state.selectedRowIndex + 1
        });

        event.preventDefault();
        break;

      case 37: // Left
        if (this.state.selectedColumnIndex === 0)
          return;

        this.setState({
          selectedColumnIndex: this.state.selectedColumnIndex - 1
        });

        event.preventDefault();
        break;

      case 39: // Right
        if (this.state.selectedColumnIndex === 5 - 1)
          return;

        this.setState({
          selectedColumnIndex: this.state.selectedColumnIndex + 1
        });

        event.preventDefault();
        break;

      case 13: // Enter
        this.refs['cell-' + this.state.selectedRowIndex + '-' + this.state.selectedColumnIndex].edit();

        event.preventDefault();
        break;
    }
  },
  onSelected: function(rowIndex, columnIndex) {
    this.setState({
      selectedRowIndex: rowIndex,
      selectedColumnIndex: columnIndex
    });
  },
  render: function() {
    return (
      <table className='issues'>
        <thead>
          <tr>
            <th>Project</th>
            <th>Milestone</th>
            <th>Title</th>
            <th>State</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.issues.map(function(issue, index) {
              return (
                <tr key={issue.id} className={this.state.selectedRowIndex === index ? 'selected' : ''}>
                  <td className={'project ' + (this.state.selectedColumnIndex === 0 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown} onClick={this.onSelected.bind(this, index, 0)}>
                    <IssueProject issue={issue} ref={'cell-' + index + '-0'} />
                  </td>
                  <td className={'milestone ' + (this.state.selectedColumnIndex === 1 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown} onClick={this.onSelected.bind(this, index, 1)}>
                    <IssueMilestone issue={issue} ref={'cell-' + index + '-1'} />
                  </td>
                  <td className={'title ' + (this.state.selectedColumnIndex === 2 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown} onClick={this.onSelected.bind(this, index, 2)}>
                    <IssueTitle issue={issue} ref={'cell-' + index + '-2'} />
                  </td>
                  <td className={'state ' + (this.state.selectedColumnIndex === 3 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown} onClick={this.onSelected.bind(this, index, 3)}>
                    <IssueState issue={issue} ref={'cell-' + index + '-3'} />
                  </td>
                  <td className={'state ' + (this.state.selectedColumnIndex === 4 ? 'selected' : '')} tabIndex="0" onKeyDown={this.onKeyDown} onClick={this.onSelected.bind(this, index, 4)}>
                    <IssueAssignedUser issue={issue} ref={'cell-' + index + '-4'} />
                  </td>
                </tr>
              );
            }, this)
          }
        </tbody>
      </table>
    );
  }
});

var FilteredIssueList = React.createClass({
  filterIssues: function(issues) {
    var _this = this;

    function filter(issues, filterItems, valueGetter, include) {
      if (filterItems.length == 0)
        return issues;

      return _.filter(issues, function(issue) {
        var value = issue[valueGetter]();

        return _.some(filterItems, function(filterItem) {
          return value && value.id === filterItem.id;
        }) == include;
      });
    }

    issues = filter(issues, _this.props.filters.milestones.include.items, 'getMilestone', true);
    issues = filter(issues, _this.props.filters.milestones.exclude.items, 'getMilestone', false);
    issues = filter(issues, _this.props.filters.states.include.items, 'getState', true);
    issues = filter(issues, _this.props.filters.states.exclude.items, 'getState', false);
    issues = filter(issues, _this.props.filters.assignedUsers.include.items, 'getAssignedUser', true);
    issues = filter(issues, _this.props.filters.assignedUsers.exclude.items, 'getAssignedUser', false);
    issues = filter(issues, _this.props.filters.projects.include.items, 'getProject', true);
    issues = filter(issues, _this.props.filters.projects.exclude.items, 'getProject', false);

    return issues;
  },
  render: function() {
    return (
      <IssueList issues={this.filterIssues(this.props.issues)} />
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      isInitialized: false,
      filters: new Filters()
    };
  },
  componentDidMount: function() {
    var _this = this;

    nautilus.on('error', function(error) {
      console.log(error); // TODO
    });

    nautilus.on('init', function() {
      _this.setState({
        isInitialized: true
      });
    });

    nautilus.on('issueChanged', function() {
      _this.forceUpdate();
    });

    nautilus.init();
  },
  onFiltersChanged: function() {
    this.setState({
      filters: this.state.filters
    });
  },
  render: function() {
    if (!this.state.isInitialized)
      return <span>Loading...</span>;

    return (
      <div>
        <div className='row'>
          <div className='column'>
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='two columns sidebar'>
            <FilterBox name='Milestone' items={nautilus.getMilestones()} displayAttribute='title' filter={this.state.filters.milestones} filters={this.state.filters} onChanged={this.onFiltersChanged} />
            <FilterBox name='State' items={nautilus.getStates()} displayAttribute='title' filter={this.state.filters.states} filters={this.state.filters} onChanged={this.onFiltersChanged} />
            <FilterBox name='Assignee' items={nautilus.getUsers()} displayAttribute='name' filter={this.state.filters.assignedUsers} filters={this.state.filters} onChanged={this.onFiltersChanged} />
            <FilterBox name='Project' items={nautilus.getProjects()} displayAttribute='name' filter={this.state.filters.projects} filters={this.state.filters} onChanged={this.onFiltersChanged} />
          </div>
          <div className='ten columns'>
            <FilteredIssueList issues={nautilus.getIssues()} filters={this.state.filters} />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  $('#app')[0]
);
