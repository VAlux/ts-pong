import {Field} from './entity/field';
import {InputEventListener, MoveActionEvent, ScoreActionEvent} from './game-event';
import {Renderer} from './renderer';
import {Actor} from "./actor";
import {CollisionResolver} from "./collision-resolver";
import {Ball} from "./entity/ball";
import {TypedEventEmitter} from "./typed-event-kit";
import {PlayerPad} from "./entity/player-pad";
import {EnemyPad} from "./entity/enemy-pad";

enum PadAlignment {
  LEFT,
  RIGHT
}

export class Game {
  private actors: Actor[];
  private isRunning: boolean;
  private readonly canvas: HTMLCanvasElement;
  private readonly playerPad: PlayerPad = new PlayerPad(0,0,0,0);
  private readonly enemyPad: EnemyPad;
  private readonly field: Field;
  private readonly ball: Ball;
  private readonly renderer: Renderer;
  private readonly inputEventListener: InputEventListener;
  private readonly scoreEventListener: TypedEventEmitter<ScoreActionEvent>;
  private readonly collisionResolver: CollisionResolver;

  constructor(canvasSelectorId: string) {
    this.canvas = (document.getElementById(canvasSelectorId)) as HTMLCanvasElement;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const aspectRatio = width > height ? height / width : width / height;

    this.scoreEventListener = new TypedEventEmitter<ScoreActionEvent>();

    this.ball = new Ball(width / 2, height / 2, aspectRatio * 10, aspectRatio * 10, this.scoreEventListener);
    this.playerPad = this.createPlayerPad(width, height);
    this.enemyPad = this.createEnemyPad(width, height);
    this.field =  new Field(0, 0, width, height);
    this.actors = [this.playerPad, this.enemyPad, this.ball];

    const gameEntities = [this.playerPad, this.enemyPad, this.field, this.ball];
    this.renderer = new Renderer(this.canvas, gameEntities);
    this.collisionResolver = new CollisionResolver(gameEntities);
    this.inputEventListener = new InputEventListener();

    this.registerEventListeners();

    this.isRunning = false;
  }

  private registerEventListeners() {
    this.scoreEventListener.on((scoreEvent) => {
      switch (scoreEvent) {
        case ScoreActionEvent.LEFT_PLAYER_SCORED:
          console.log('left scored!');
          break;
        case ScoreActionEvent.RIGHT_PLAYER_SCORED:
          console.log('right scored!');
          break;
      }
    });

    this.inputEventListener.registerKeyboardEventListener();

    this.inputEventListener.eventEmitter.on((action) => {
      switch (action) {
        case MoveActionEvent.MOVE_UP:
          this.playerPad.moveTo(0, 4);
          break;
        case MoveActionEvent.MOVE_DOWN:
          this.playerPad.moveTo(0, -4);
          break;
      }
    });
  }

  public start() {
    this.setRunning(true);
    window.requestAnimationFrame(() => this.tick());
  }

  public setRunning(value: boolean) {
    this.isRunning = value;
  }

  public tick(): void {
    if (this.isRunning) {
      this.collisionResolver.resolveCollisions();
      this.actors.forEach((actor) => actor.act());
      this.renderer.render();
      window.requestAnimationFrame(() => this.tick());
    }
  }

  private createPlayerPad(width: number, height: number, align: PadAlignment = PadAlignment.LEFT): PlayerPad {
    const {padWidth, padHeight, padPositionX, padPositionY} = Game.calculatePadPosition(width, height, align);

    return new PlayerPad(
      padPositionX,
      padPositionY,
      padWidth,
      padHeight);
  }

  private createEnemyPad(width: number, height: number, align: PadAlignment = PadAlignment.RIGHT): EnemyPad {
    const {padWidth, padHeight, padPositionX, padPositionY} = Game.calculatePadPosition(width, height, align);

    return new EnemyPad(
      padPositionX,
      padPositionY,
      padWidth,
      padHeight,
      this.ball);
  }

  private static calculatePadPosition(canvasWidth: number, canvasHeight: number, align: PadAlignment) {
    const padWidth = canvasWidth / 60;
    const padHeight = canvasHeight / 5;

    switch (align) {
      case PadAlignment.LEFT: {
        const padPositionX = canvasWidth - (canvasWidth - padWidth);
        const padPositionY = canvasHeight - (canvasHeight / 2 + padHeight);
        return {padWidth, padHeight, padPositionX, padPositionY};
      }
      case PadAlignment.RIGHT: {
        const padPositionX = canvasWidth - (padWidth * 2);
        const padPositionY = canvasHeight - (canvasHeight / 2 + padHeight);
        return {padWidth, padHeight, padPositionX, padPositionY};
      }
    }
  }
}

function main() {
  const game = new Game('game-canvas');
  game.start();
}

main();
