import { ActionPayload, ActionType } from '../constants/ACTIONS';
import { Battle } from './Battle';
import { Combatant, Team } from './Combatant';
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

    // Stop here is we are replacing this Pizza:
    if (submission.replacement) {
      await this.onNewEvent({
        type: ActionType.Replace,
        replacement: submission.replacement,
      });

      await this.onNewEvent({
        type: ActionType.TextMessage,
        text: `Go get 'em, ${submission.replacement.name}`,
      });

      this.nextTurn();

      return;
    }

    if (submission.instanceId) {
      this.battle.items = this.battle.items.filter(
        (item) => item.instanceId !== submission.instanceId
      );
    }

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

    // Did the target die?
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: ActionType.TextMessage,
        text: `${submission.target.name} is ruined!`,
      });
    }

    // Do we have a winner team?
    const winner = this.getWinningTeam();
    if (winner) {
      // End the battle:
      await this.onNewEvent({
        type: ActionType.TextMessage,
        text: 'Winner!',
      });

      return;
    }

    // We have a dead target, but still no winner, so bring in a replacement
    if (targetDead) {
      const replacement: Combatant = await this.onNewEvent({
        type: ActionType.ReplacementMenu,
        team: submission.target.team,
      });
      await this.onNewEvent({
        type: ActionType.Replace,
        replacement,
      });
      await this.onNewEvent({
        type: ActionType.TextMessage,
        text: `${replacement.name} appears!`,
      });
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

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam =
      this.currentTeam === Team.Player ? Team.Enemy : Team.Player;
    this.turn();
  }

  getWinningTeam(): Team | null {
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach((combatant) => {
      if (combatant.hp > 0) {
        aliveTeams[combatant.team] = true;
      }
    });

    if (!aliveTeams[Team.Player]) {
      return Team.Enemy;
    }

    if (!aliveTeams[Team.Enemy]) {
      return Team.Player;
    }

    return null;
  }

  async init() {
    // await this.onNewEvent({
    //   type: ActionType.TextMessage,
    //   text: 'The battle is starting!',
    // });

    // Start the first turn:
    this.turn();
  }
}
