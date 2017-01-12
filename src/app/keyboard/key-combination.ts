import { IKeyCombination } from './ikey-combination';
import { IShortcut } from './ishortcut';

export class KeyCombination {
  static matches(keyCombination: IKeyCombination, event: KeyboardEvent) {
    if (keyCombination.keyCode !== event.keyCode)
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

  static matchesSome(keyCombinations: IShortcut, events: KeyboardEvent[]) {
    let min = Math.min(keyCombinations.length, events.length);
    let i: number;

    for (i = 0; i < min; i++)
      if (!this.matches(keyCombinations[i], events[i]))
        break;

    return i;
  }
}
