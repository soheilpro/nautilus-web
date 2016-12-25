import * as React from 'react';
import { IShortcut, KeyName } from '../../keyboard';

require('./index.less');

interface IShortcutProps {
  shortcut: IShortcut;
}

export default class Shortcut extends React.Component<IShortcutProps, {}> {
  render() {
    return (
      <div className="shortcut component">
        {
          this.props.shortcut.keyCombinations.map((keyCombination, index) => {
            return (
              <span key={index}>
                <span className="key-combination">{KeyName[keyCombination.which]}</span>
                {
                  index !== this.props.shortcut.keyCombinations.length - 1 ?
                    <span className="separator">,</span>
                    : null
                }
              </span>
            );
          })
        }
      </div>
    );
  }
};
