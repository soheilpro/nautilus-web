import * as React from 'react';

interface EditableProps {
  isEditable: boolean;
  isMultiline?: boolean;
  placeholder: string;
  value: any;
  values?: any[];
  spanStyle?: Object;
  inputStyle?: Object;
  spanClassName?: string;
  inputClassName?: string;
  valueFromString?(value: string, values: any[]): any;
  valueToString?(value: any, full: boolean): string;
  valueComparer?(value1: any, value2: any): boolean;
  onValueChanged(value: any): void;
}

export class Editable extends React.Component<EditableProps, {}> {
  private containerElement: Element;
  private spanElement: Element;
  private inputElement: Element;
  isEditing: boolean;

  startEditing() {
    if (!this.props.isEditable)
      return;

    this.isEditing = true;
    $(this.containerElement).addClass('editing');

    if (!this.props.isMultiline)
      $(this.inputElement).css({'min-width': $(this.spanElement).width()});
    else
      ($(this.inputElement) as any).textareaAutoSize();

    $(this.inputElement)
      .val(this.props.valueToString(this.props.value, false))
      .select()
      .focus();

    if (this.props.isMultiline)
      $(this.inputElement).trigger('input');

    if (this.props.values) {
      if (!$(this.inputElement).autocomplete('instance')) {
        $(this.inputElement)
          .autocomplete({
            source: _.map(this.props.values, value => {
              return {
                value: value,
                label: this.props.valueToString(value, true),
              };
            }),
            position: { collision: "flip" },
            delay: 0,
            minLength: 0,
            focus: (event, ui) => {
              $(this.inputElement).val(ui.item.label).select();
              return false;
            },
            select: (event, ui) => {
              var value = ui.item.value;

              if (!this.props.valueComparer(value, this.props.value))
                this.props.onValueChanged(value);

              this.endEditing();
            }
          })
      }

      $(this.inputElement).autocomplete('search', '');
    }
  }

  endEditing() {
    this.isEditing = false;

    $(this.containerElement).parent().focus();
    $(this.containerElement).removeClass('editing');
  }

  save() {
    var value = $(this.inputElement).val();

    if (this.props.values)
      value = this.props.valueFromString(value, this.props.values);

    if (!this.props.valueComparer(value, this.props.value))
      this.props.onValueChanged(value);

    this.endEditing();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.which === 27)
      this.endEditing();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.which === 13) {
      if (!this.props.isMultiline)
        this.save();
      else
        if (event.ctrlKey)
          this.save();
    }
  }

  onBlur() {
    if (this.isEditing)
      this.save();
  }

  render() {
    var value = this.props.value;
    var spanElement: any;
    var inputElement: any;

    if (value)
      spanElement = <span className={this.props.spanClassName} style={this.props.spanStyle} ref={(ref) => this.spanElement = ref}>{this.props.valueToString(value, false)}</span>
    else
      spanElement = <span className='placeholder' style={this.props.spanStyle} ref={(ref) => this.spanElement = ref}>{this.props.placeholder}</span>

    if (!this.props.isMultiline)
      inputElement = <input className='input' style={this.props.inputStyle} onKeyDown={this.onKeyDown.bind(this)} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)} ref={(ref) => this.inputElement = ref} />
    else
      inputElement = <textarea className='input' style={this.props.inputStyle} onKeyDown={this.onKeyDown.bind(this)} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)} ref={(ref) => this.inputElement = ref} />

    return (
      <div className={'editable ' + (this.props.isMultiline ? 'multiline' : '')} onDoubleClick={this.startEditing.bind(this)} ref={(ref) => this.containerElement = ref}>
        { spanElement }
        { inputElement }
      </div>
    );
  }
}