import * as React from 'react';
import * as classNames from 'classnames';
import { ItemKind, IItem } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IItemSelectProps {
  itemKind: ItemKind;
  item: IItem;
  className?: string;
  onChange(item: IItem): void;
}

interface IItemSelectState {
  items?: IItem[];
}

export default class ItemSelect extends React.Component<IItemSelectProps, IItemSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      items: [],
    };
  }

  async componentDidMount() {
    this.setState({
      items: await this.application.items.getAllByKind(this.props.itemKind),
    });
  }

  private handleSelectChange(item: IItem) {
    this.props.onChange(item);
  }

  render() {
    return (
      <Select className={classNames('item-select-component', this.props.className)} selectedItem={this.props.item} items={this.state.items} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
