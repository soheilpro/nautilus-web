import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { ItemKind, IItemPriority } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IItemPrioritySelectProps {
  itemKind: ItemKind;
  itemPriority: IItemPriority;
  className?: string;
  onChange(itemPriority: IItemPriority): void;
}

interface IItemPrioritySelectState {
  itemPriorities?: IItemPriority[];
}

export default class ItemPrioritySelect extends React.PureComponent<IItemPrioritySelectProps, IItemPrioritySelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      itemPriorities: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemPriorities: _.sortBy(this.application.itemPriorities.getAll(this.props.itemKind), itemPriority => itemPriority.order),
    });
  }

  private handleSelectChange(itemPriority: IItemPriority) {
    this.props.onChange(itemPriority);
  }

  render() {
    return (
      <Select className={classNames('item-priority-select-component', this.props.className)} selectedItem={this.props.itemPriority} items={this.state.itemPriorities} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
