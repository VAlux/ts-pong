import {Actor} from '../actor';
import {CollisionDirection} from '../collision-resolver';
import {ScoreActionEvent} from '../game-event';
import {MathEx} from '../math-ex';
import {TypedEventEmitter} from '../typed-event-kit';
import {Drawable} from './drawable';
import {Field} from './field';
import {PhysicalEntity} from './physical-entity';
import { Pad } from './pad';

export class Ball extends PhysicalEntity implements Drawable, Actor {

  private readonly scoreEventEmitter: TypedEventEmitter<ScoreActionEvent>;

  constructor(protected posX: number,
              protected posY: number,
              protected width: number,
              protected height: number,
              scoreEmitter: TypedEventEmitter<ScoreActionEvent>) {

    super(posX, posY, width, height);

    this.velocityX = MathEx.random(-10, 10);
    this.velocityY = MathEx.random(-10, 10);
    this.scoreEventEmitter = scoreEmitter;
  }

  public act(): void {
    this.posX += this.velocityX;
    this.posY += this.velocityY;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.strokeStyle = '#3c43ff';
    context.ellipse(this.posX, this.posY, this.width, this.height, 0, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
  }

  public checkCollisionWith(target: PhysicalEntity): CollisionDirection {
    if (target instanceof Field) {
      if (this.x - this.width < target.x) {
        this.scoreEventEmitter.emit(ScoreActionEvent.RIGHT_PLAYER_SCORED);
        return CollisionDirection.LEFT;
      }

      if (this.x + this.width > target.x + target.w) {
        this.scoreEventEmitter.emit(ScoreActionEvent.LEFT_PLAYER_SCORED);
        return CollisionDirection.RIGHT;
      }

      if (this.y - this.height < target.y) {
        return CollisionDirection.UP;
      }

      if (this.y + this.height > target.y + target.h) {
        return CollisionDirection.DOWN;
      }
    } else if (target instanceof Pad) {
       // we do not care about the up and down collisions in this case
      if (this.y > target.y && this.y < target.y + target.h) {
        if (this.x > target.x + target.w && this.x - this.w < target.x + target.w) {
          return CollisionDirection.LEFT;
        }

        if (this.x < target.x && this.x + this.w > target.x) {
          return CollisionDirection.RIGHT;
        }
      }
    }

    return CollisionDirection.NO_COLLISION;
  }

  // @ts-ignore
  public resolveCollisionWith(target: PhysicalEntity, direction: CollisionDirection): void {
    // we do not care about the target in this case
    switch (direction) {
      case CollisionDirection.NO_COLLISION:
        break;
      case CollisionDirection.LEFT:
        this.posX += 1;
        this.velocityX *= -1;
        break;
      case CollisionDirection.RIGHT:
        this.posX -= 1;
        this.velocityX *= -1;
        break;
      case CollisionDirection.UP:
        this.posY += 1;
        this.velocityY *= -1;
        break;
      case CollisionDirection.DOWN:
        this.posY -= 1;
        this.velocityY *= -1;
        break;
    }
  }
}
