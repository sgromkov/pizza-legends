import {
  Action,
  ActionItem,
  ActionKey,
  ActionTargetType,
} from '../constants/ACTIONS';
import { Combatant } from './Combatant';
import { KeyboardMenu } from '../KeyboardMenu';

export interface SubmissionMenuResultPayload {
  action: Action;
  target: Combatant;
  instanceId?: string;
}

export interface SubmissionMenuOption {
  label: string;
  description: string;
  handler: Function;
  right?: () => string;
  disabled?: boolean;
}

export enum SubmissionMenuPageKey {
  Root = 'root',
  Attacks = 'attacks',
  Items = 'items',
}

interface SubmissionMenuItem {
  quantity: number;
  actionId: ActionKey;
  instanceId: string;
}

export class SubmissionMenu {
  caster: Combatant;
  enemy: Combatant;
  onComplete: (SubmissionMenuResultPayload) => any;
  keyboardMenu: KeyboardMenu;
  items: SubmissionMenuItem[];

  constructor({
    caster,
    enemy,
    onComplete,
    items,
  }: {
    caster: Combatant;
    enemy: Combatant;
    onComplete: (SubmissionMenuResultPayload) => any;
    items: ActionItem[];
  }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;

    let quantityMap: Partial<Record<ActionKey, SubmissionMenuItem>> = {};
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

  getPages(): Record<SubmissionMenuPageKey, SubmissionMenuOption[]> {
    const backOption: SubmissionMenuOption = {
      label: 'Go back',
      description: 'Return to previous page',
      handler: () => {
        this.keyboardMenu.setOptions(
          this.getPages()[SubmissionMenuPageKey.Root]
        );
      },
    };

    const pages: Record<SubmissionMenuPageKey, SubmissionMenuOption[]> = {
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
            // See pizza options...
          },
        },
      ],
      [SubmissionMenuPageKey.Attacks]: [
        ...this.caster.actions.map((key) => {
          const action = window.ACTIONS[key];
          const option: SubmissionMenuOption = {
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
          const option: SubmissionMenuOption = {
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
    };

    return pages;
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
