import {Drawable} from './drawable';
import {PhysicalEntity} from './physical-entity'
import {Actor} from "../actor";
import {MathEx} from "../MathEx";
import {Field} from "./field";
import {CollisionDirection} from "../collision-resolver";

export class Pad extends PhysicalEntity implements Drawable, Actor {

  private readonly dampeningThreshold = 0.01;
  private readonly dampeningFactor = 0.05; // TODO: should this be faster?

  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.fillStyle = '#66ab66';
    context.fillRect(this.posX, this.posY, this.width, this.height);
    context.closePath();
  }

  act(): void {
    this.posX += this.velocityX;
    this.posY += this.velocityY;

    if (Math.abs(MathEx.round(this.velocityX, this.dampeningThreshold)) !== this.dampeningThreshold) {
      this.velocityX = MathEx.lerp(this.velocityX, 0, this.dampeningFactor)
    }

    if (Math.abs(MathEx.round(this.velocityY, this.dampeningThreshold)) !== this.dampeningThreshold) {
      this.velocityY = MathEx.lerp(this.velocityY, 0, this.dampeningFactor)
    }
  }

  resolveCollisionWith(target: PhysicalEntity, direction: CollisionDirection): void {
    if (target instanceof Field) {
      // TODO: maybe add field bouncing suppressor factor??
      if (direction === CollisionDirection.UP || direction === CollisionDirection.DOWN) {
        this.velocityY *= -1;
      }
    }
  }

  checkCollisionWith(target: PhysicalEntity): CollisionDirection {
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
