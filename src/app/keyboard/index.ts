export interface IKeyCombination {
  which: number;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

export class KeyCombination {
  static matches(keyCombination: IKeyCombination, event: KeyboardEvent): boolean {
    if (keyCombination.which !== event.which)
      return false;

    if ((keyCombination.ctrlKey || false) !== event.ctrlKey)
      return false;

    if ((keyCombination.shiftKey || false) !== event.shiftKey)
      return false;

    if ((keyCombination.altKey || false) !== event.altKey)
      return false;

    if ((keyCombination.metaKey || false) !== event.metaKey)
      return false;

    return true;
  }

  static matchesAll(keyCombinations: IKeyCombination[], events: KeyboardEvent[]): boolean {
    if (keyCombinations.length !== events.length)
      return false;

    for (let i = 0; i < keyCombinations.length; i++)
      if (!this.matches(keyCombinations[i], events[i]))
        return false;

    return true;
  }
}

export interface IShortcut {
  keyCombinations: IKeyCombination[];
}

interface ICondition {
  (event: KeyboardEvent): boolean;
}

interface IHandler {
  (event: KeyboardEvent): void;
}

export class KeyMaster {
  static handle(event: KeyboardEvent, keyCombination: IKeyCombination, condition: boolean | ICondition, handler: IHandler, preventDefault?: boolean) {
    if (!KeyCombination.matches(keyCombination, event))
      return;

    if (condition !== null) {
      if (typeof condition === 'boolean') {
        if (!condition)
          return;
      }
      else if (!condition(event)) {
        return;
      }
    }

    let result = handler(event);

    if (preventDefault !== undefined ? preventDefault: result)
      event.preventDefault();
  }
}

export function isInputEvent(event: KeyboardEvent) {
  return (event.target as HTMLElement).nodeName === 'INPUT' ||
         (event.target as HTMLElement).nodeName === 'TEXTAREA';
}

export enum KeyCode {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Ctrl = 17,
  Alt = 18,
  Pause = 19,
  CapsLock = 20,
  Escape = 27,
  Space = 32,
  PageUp = 33,
  PageDown = 34,
  End = 35,
  Home = 36,
  LeftArrow = 37,
  UpArrow = 38,
  RightArrow = 39,
  DownArrow = 40,
  Insert = 45,
  Delete = 46,
  Num1 = 49,
  Num2 = 50,
  Num3 = 51,
  Num4 = 52,
  Num5 = 53,
  Num6 = 54,
  Num7 = 55,
  Num8 = 56,
  Num9 = 57,
  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,
  LeftMeta = 91,
  RightMeta = 92,
  Select = 93,
  Numpad0 = 96,
  Numpad1 = 97,
  Numpad2 = 98,
  Numpad3 = 99,
  Numpad4 = 100,
  Numpad5 = 101,
  Numpad6 = 102,
  Numpad7 = 103,
  Numpad8 = 104,
  Numpad9 = 105,
  Multiply = 106,
  Add = 107,
  Subtract = 109,
  Decimal = 110,
  Divide = 111,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
  NumLock = 144,
  ScrollLock = 145,
  Semicolon = 186,
  Equals = 187,
  Comma = 188,
  Dash = 189,
  Period = 190,
  ForwardSlash = 191,
  GraveAccent = 192,
  OpenBracket = 219,
  BackSlash = 220,
  CloseBracket = 221,
  SingleQuote = 222,
}

export let KeyName: {[code: number]: string} = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  19: 'Pause',
  20: 'Caps Lock',
  27: 'Escape',
  32: 'Space',
  33: 'Page Up',
  34: 'Page Down',
  35: 'End',
  36: 'Home',
  37: '←',
  38: '↑',
  39: '→',
  40: '↓',
  45: 'Insert',
  46: 'Delete',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
  91: 'Left Meta',
  92: 'Right Meta',
  93: 'Select',
  96: 'Numpad 0',
  97: 'Numpad 1',
  98: 'Numpad 2',
  99: 'Numpad 3',
  100: 'Numpad 4',
  101: 'Numpad 5',
  102: 'Numpad 6',
  103: 'Numpad 7',
  104: 'Numpad 8',
  105: 'Numpad 9',
  106: 'Multiply',
  107: 'Add',
  109: 'Subtract',
  110: 'Decimal',
  111: 'Divide',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  144: 'Num Lock',
  145: 'Scroll Lock',
  186: 'Semicolon',
  187: 'Equals',
  188: 'Comma',
  189: 'Dash',
  190: 'Period',
  191: 'Forward Slash',
  192: 'Grave Accent',
  219: 'Open Bracket',
  220: 'Back Slash',
  221: 'Close Bracket',
  222: 'Single Quote',
};
