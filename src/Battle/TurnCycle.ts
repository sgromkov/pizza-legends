import { ActionPayload, ActionType } from '../constants/ACTIONS';
import { Battle } from './Battle';
import { Team } from './Combatant';
import { SubmissionMenuResultPayload } from './SubmissionMenu';

export class TurnCycle {
  battle: Battle;
  onNewEvent: (ActionPayload) => Promise<any>;
  currentTeam: Team;

  constructor({
    battle,
    onNewEvent,
  }: {
    battle: Battle;
    onNewEvent: (ActionPayload) => Promise<void>;
  }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.currentTeam = Team.Player;
  }

  async turn() {
    // Get the caster:
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];

    // Get the caster's enemy:
    const enemyTeam = caster.team === Team.Player ? Team.Enemy : Team.Player;
    const enemyId = this.battle.activeCombatants[enemyTeam];
    const enemy = this.battle.combatants[enemyId];

    const submission: SubmissionMenuResultPayload = await this.onNewEvent({
      type: ActionType.SubmissionMenu,
      caster,
      enemy,
    });

    const resultingEvents = caster.getReplacedEvents(submission.action.success);
    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    // Check for post events:
    // (Do things after your original turn submission)
    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    // Check for status expire:
    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    this.currentTeam =
      this.currentTeam === Team.Player ? Team.Enemy : Team.Player;
    this.turn();
  }

  async init() {
    await this.onNewEvent({
      type: ActionType.TextMessage,
      text: 'The battle is starting!',
    });

    // Start the first turn:
    this.turn();
  }
}
