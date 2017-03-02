import React from 'react';
import classNames from 'classnames';
import { ItemKind, IItemType } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IItemTypeSelectProps {
  itemKind: ItemKind;
  itemType: IItemType;
  className?: string;
  onChange(itemType: IItemType): void;
}

interface IItemTypeSelectState {
  itemTypes?: IItemType[];
}

export default class ItemTypeSelect extends React.Component<IItemTypeSelectProps, IItemTypeSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      itemTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemTypes: this.application.itemTypes.getAll(this.props.itemKind),
    });
  }

  private handleSelectChange(itemType: IItemType) {
    this.props.onChange(itemType);
  }

  render() {
    return (
      <Select className={classNames('item-type-select-component', this.props.className)} selectedItem={this.props.itemType} items={this.state.itemTypes} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
