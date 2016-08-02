import * as React from 'react';

interface EditableProps {
  item;
  items?;
  spanStyle?;
  inputStyle?;
  itemFromString?(value, items);
  itemToString?(item);
  itemComparer?(item1, item2);
  onItemChanged(item);
}

export class Editable extends React.Component<EditableProps, {}> {
  private containerElement;
  private spanElement;
  private inputElement;
  private focused;

  onKeyDown(event) {
    if (event.which !== 27)
      return;

    this.endEditing();
  }

  onKeyPress(event) {
    if (event.which !== 13)
      return;

    //- if (this.focused)
    //-   return;

    var item = $(this.inputElement).val();

    if (this.props.items)
      item = this.props.itemFromString(item, this.props.items);

    this.onItemChanged(item);
    this.endEditing();
  }

  startEditing() {
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
          focus(event, ui) {
            this.focused = true;
          },
          select: (event, ui) => {
            var item = this.props.itemFromString(ui.item.value, this.props.items);
            this.onItemChanged(item);
            this.endEditing();
          }
        })
        .autocomplete('search', '');
    }
  }

  endEditing() {
    $(this.containerElement).parent().focus();
    $(this.containerElement).removeClass('editing');
  }

  onItemChanged(item) {
    if (this.props.itemComparer(item, this.props.item))
      return;

    this.props.onItemChanged(item);
  }

  render() {
    return (
      <div className='editable' onDoubleClick={this.startEditing.bind(this)} ref={(ref) => this.containerElement = ref}>
        <span style={this.props.spanStyle} ref={(ref) => this.spanElement = ref}>{this.props.itemToString(this.props.item)}</span>
        <input style={this.props.inputStyle} onKeyDown={this.onKeyDown.bind(this)} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.endEditing.bind(this)} ref={(ref) => this.inputElement = ref} />
      </div>
    );
  }
}