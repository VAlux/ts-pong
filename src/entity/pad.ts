import {Actor} from '../actor';
import {CollisionDirection} from '../collision-resolver';
import {MathEx} from '../math-ex';
import {Drawable} from './drawable';
import {Field} from './field';
import {PhysicalEntity} from './physical-entity';

export class Pad extends PhysicalEntity implements Drawable, Actor {

  private readonly dampeningThreshold = 0.01;
  private readonly dampeningFactor = 0.05; // TODO: should this be faster?

  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.fillStyle = '#66ab66';
    context.fillRect(this.posX, this.posY, this.width, this.height);
    context.closePath();
  }

  public act(): void {
    this.posX += this.velocityX;
    this.posY += this.velocityY;

    if (Math.abs(MathEx.round(this.velocityX, this.dampeningThreshold)) !== this.dampeningThreshold) {
      this.velocityX = MathEx.lerp(this.velocityX, 0, this.dampeningFactor);
    }

    if (Math.abs(MathEx.round(this.velocityY, this.dampeningThreshold)) !== this.dampeningThreshold) {
      this.velocityY = MathEx.lerp(this.velocityY, 0, this.dampeningFactor);
    }
  }

  public resolveCollisionWith(target: PhysicalEntity, direction: CollisionDirection): void {
    if (target instanceof Field) {
      if (direction === CollisionDirection.UP) {
        this.posY += 2;
        this.velocityY *= -0.5;
      } else if (direction === CollisionDirection.DOWN) {
        this.posY -= 2;
        this.velocityY *= -0.5;
      }
    }
  }

  public checkCollisionWith(target: PhysicalEntity): CollisionDirection {
    if (target instanceof Field) {
      if (this.y < target.y) {
        return CollisionDirection.UP;
      }

      if (this.y + this.height > target.y + target.h) {
        return CollisionDirection.DOWN;
      }
    }

    return CollisionDirection.NO_COLLISION;
  }
}
