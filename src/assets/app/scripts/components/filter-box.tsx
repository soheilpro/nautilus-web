import * as React from 'react';

interface FilterBoxProps {
  filters;
  filter;
  name;
  items;
  displayAttribute;
  onChanged();
}

export class FilterBox extends React.Component<FilterBoxProps, {}> {
  onItemSelected(item) {
    this.props.filters.clear();
    this.props.filter.include.set(item);
    this.props.onChanged();
  }

  onItemIncluded(item, event) {
    this.props.filter.include.toggle(item, event.target.checked);
    this.props.onChanged();
  }

  onItemExcluded(item, event) {
    this.props.filter.exclude.toggle(item, event.target.checked);
    this.props.onChanged();
  }

  render() {
    return (
      <div>
        <label>{this.props.name}</label>
        {
          this.props.items.map((item) => {
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
}
