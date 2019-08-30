import {Field} from './entity/field';
import {InputEventListener, MoveActionEvent, ScoreActionEvent} from './game-event';
import {Renderer} from './renderer';
import {Actor} from "./actor";
import {CollisionResolver} from "./collision-resolver";
import {Ball} from "./entity/ball";
import {TypedEventEmitter} from "./typed-event-kit";
import {PlayerPad} from "./entity/player-pad";
import {EnemyPad} from "./entity/enemy-pad";

export class Game {
  private actors: Actor[];
  private isRunning: boolean;
  private readonly canvas: HTMLCanvasElement;
  private readonly playerPad: PlayerPad;
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
    this.field = this.createField(width, height);

    this.actors = new Array<Actor>(this.playerPad, this.enemyPad, this.ball);
    const gameEntities = Array(this.playerPad, this.enemyPad, this.field, this.ball);
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
          this.playerPad.moveTo(0, 2);
          break;
        case MoveActionEvent.MOVE_DOWN:
          this.playerPad.moveTo(0, -2);
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

  private createField(width: number, height: number): Field {
    return new Field(0, 0, width, height);
  }

  private createPlayerPad(width: number, height: number): PlayerPad {
    const padWidth = width / 60;
    const padHeight = height / 5;
    const padPositionX = width - (width - padWidth);
    const padPositionY = height - (height / 2 + padHeight);

    return new PlayerPad(
      padPositionX,
      padPositionY,
      padWidth,
      padHeight);
  }

  private createEnemyPad(width: number, height: number): EnemyPad {
    const padWidth = width / 60;
    const padHeight = height / 5;
    const padPositionX = width - padWidth;
    const padPositionY = height - (height / 2 + padHeight);

    return new EnemyPad(
      padPositionX,
      padPositionY,
      padWidth,
      padHeight,
      this.ball);
  }
}

function main() {
  const game = new Game('game-canvas');
  game.start();
}

main();
