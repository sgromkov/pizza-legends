import { KeyboardMenu, KeyboardMenuOption } from '../KeyboardMenu';
import { Combatant } from './Combatant';

export class ReplacementMenu {
  replacements: Combatant[];
  onComplete: (payload: Combatant) => void;
  keyboardMenu: KeyboardMenu;

  constructor({
    replacements,
    onComplete,
  }: {
    replacements: Combatant[];
    onComplete: (payload: Combatant) => void;
  }) {
    this.replacements = replacements;
    this.onComplete = onComplete;
  }

  decide() {
    this.menuSubmit(this.replacements[0]);
  }

  menuSubmit(replacement: Combatant) {
    this.keyboardMenu?.end();
    this.onComplete(replacement);
  }

  showMenu(container: HTMLElement) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(
      this.replacements.map((replacement) => {
        const option: KeyboardMenuOption = {
          label: replacement.name,
          description: replacement.description,
          handler: () => {
            this.menuSubmit(replacement);
          },
        };

        return option;
      })
    );
  }

  init(container: HTMLElement) {
    if (this.replacements[0].isPlayerControlled) {
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
