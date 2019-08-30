import {Drawable} from './drawable';
import {PhysicalEntity} from './physical-entity';
import {CollisionDirection} from "../collision-resolver";

export class Field extends PhysicalEntity implements Drawable {
  public draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.strokeStyle = '#222222';
    context.lineWidth = 5;
    context.strokeRect(this.posX, this.posY, this.width, this.height);
    context.closePath();
  }

  // @ts-ignore
  resolveCollisionWith(target: PhysicalEntity, direction: CollisionDirection): void {
    // nothing to do here
  }

  // @ts-ignore
  checkCollisionWith(target: PhysicalEntity): CollisionDirection {
    return CollisionDirection.NO_COLLISION; // field do not collide with anything by itself
  }
}
