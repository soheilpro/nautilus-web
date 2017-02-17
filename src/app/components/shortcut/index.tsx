import * as React from 'react';
import { KeyName, IShortcut } from '../../keyboard';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IShortcutProps {
  shortcut: IShortcut;
}

interface IShortcutState {
}

export default class Shortcut extends React.Component<IShortcutProps, IShortcutState> {
  render() {
    if (!this.props.shortcut)
      return null;

    return (
      <div className="shortcut-component">
        {
          this.props.shortcut.map((keyCombination, index) => {
            return (
              <span key={index}>
                <span className="key-combination">{KeyName[keyCombination.keyCode]}</span>
                {
                  index !== this.props.shortcut.length - 1 &&
                    <span className="separator">,</span>
                }
              </span>
            );
          })
        }
      </div>
    );
  }
};
