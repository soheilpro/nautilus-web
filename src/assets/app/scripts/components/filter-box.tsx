import * as React from 'react';
import { FilterSet, DualSet } from '../filter';

interface FilterBoxProps {
  filters: FilterSet;
  filter: DualSet;
  name: string;
  items: any[];
  displayAttribute: string;
  onChanged(): () => void;
}

export class FilterBox extends React.Component<FilterBoxProps, {}> {
  onItemSelected(item: any) {
    this.props.filters.clear();
    this.props.filter.include.set(item);
    this.props.onChanged();
  }

  onItemIncluded(item: any, event: Event) {
    this.props.filter.include.toggle(item, (event.target as HTMLInputElement).checked);
    this.props.onChanged();
  }

  onItemExcluded(item: any, event: Event) {
    this.props.filter.exclude.toggle(item, (event.target as HTMLInputElement).checked);
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
