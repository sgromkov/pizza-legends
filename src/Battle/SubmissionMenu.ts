import {
  Action,
  ActionItem,
  ActionId,
  ActionTargetType,
} from '../constants/ACTIONS';
import { Combatant } from './Combatant';
import { KeyboardMenu, KeyboardMenuOption } from '../KeyboardMenu';

export interface SubmissionMenuResultPayload {
  action?: Action;
  target?: Combatant;
  instanceId?: string;
  replacement?: Combatant;
}

export enum SubmissionMenuPageKey {
  Root = 'root',
  Attacks = 'attacks',
  Items = 'items',
  Replacements = 'replacements',
}

interface SubmissionMenuItem {
  quantity: number;
  actionId: ActionId;
  instanceId: string;
}

export class SubmissionMenu {
  caster: Combatant;
  enemy: Combatant;
  onComplete: (payload: SubmissionMenuResultPayload) => any;
  keyboardMenu: KeyboardMenu;
  items: SubmissionMenuItem[];
  replacements: Combatant[];

  constructor({
    caster,
    enemy,
    onComplete,
    items,
    replacements,
  }: {
    caster: Combatant;
    enemy: Combatant;
    onComplete: (payload: SubmissionMenuResultPayload) => any;
    items: ActionItem[];
    replacements: Combatant[];
  }) {
    this.caster = caster;
    this.enemy = enemy;
    this.replacements = replacements;
    this.onComplete = onComplete;

    let quantityMap: Partial<Record<ActionId, SubmissionMenuItem>> = {};
    items.forEach((item) => {
      if (item.team === caster.team) {
        let existing = quantityMap[item.actionId];

        if (existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          };
        }
      }
    });

    this.items = Object.values(quantityMap);
  }

  getPages(): Record<SubmissionMenuPageKey, KeyboardMenuOption[]> {
    const backOption: KeyboardMenuOption = {
      label: 'Go back',
      description: 'Return to previous page',
      handler: () => {
        this.keyboardMenu.setOptions(
          this.getPages()[SubmissionMenuPageKey.Root]
        );
      },
    };

    const pages: Record<SubmissionMenuPageKey, KeyboardMenuOption[]> = {
      [SubmissionMenuPageKey.Root]: [
        {
          label: 'Attack',
          description: 'Choose an attack',
          handler: () => {
            this.keyboardMenu.setOptions(
              this.getPages()[SubmissionMenuPageKey.Attacks]
            );
          },
        },
        {
          label: 'Items',
          description: 'Choose an item',
          handler: () => {
            this.keyboardMenu.setOptions(
              this.getPages()[SubmissionMenuPageKey.Items]
            );
          },
        },
        {
          label: 'Swap',
          description: 'Change to another pizza',
          handler: () => {
            this.keyboardMenu.setOptions(
              this.getPages()[SubmissionMenuPageKey.Replacements]
            );
          },
        },
      ],
      [SubmissionMenuPageKey.Attacks]: [
        ...this.caster.actions.map((id) => {
          const action = window.ACTIONS[id];
          const option: KeyboardMenuOption = {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action);
            },
          };

          return option;
        }),
        backOption,
      ],
      [SubmissionMenuPageKey.Items]: [
        ...this.items.map((item) => {
          const action = window.ACTIONS[item.actionId];
          const option: KeyboardMenuOption = {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action, item.instanceId);
            },
            right: () => {
              return 'x' + item.quantity;
            },
          };

          return option;
        }),
        backOption,
      ],
      [SubmissionMenuPageKey.Replacements]: [
        ...this.replacements.map((replacement) => {
          const option: KeyboardMenuOption = {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              this.menuSubmitReplacement(replacement);
            },
          };

          return option;
        }),
        backOption,
      ],
    };

    return pages;
  }

  menuSubmitReplacement(replacement: Combatant) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement,
    });
  }

  menuSubmit(action: Action, instanceId: string = null) {
    this.keyboardMenu?.end();

    this.onComplete({
      action,
      instanceId,
      target:
        action.targetType === ActionTargetType.Friendly
          ? this.caster
          : this.enemy,
    });
  }

  decide() {
    /**
     * @todo Enemies should randomly decide what to do...
     */
    this.menuSubmit(window.ACTIONS[this.caster.actions[0]]);
  }

  showMenu(container: HTMLElement) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages()[SubmissionMenuPageKey.Root]);
  }

  init(container: HTMLElement) {
    if (this.caster.isPlayerControlled) {
      // Show some UI:
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
