import {CollisionDirection} from '../collision-resolver';

export abstract class PhysicalEntity {

  protected velocityX: number = 0;
  protected velocityY: number = 0;

  constructor(
    protected posX: number,
    protected posY: number,
    protected width: number,
    protected height: number,
  ) {
  }

  public abstract checkCollisionWith(target: PhysicalEntity): CollisionDirection;

  public abstract resolveCollisionWith(target: PhysicalEntity, direction: CollisionDirection): void;

  get x() {
    return this.posX;
  }

  get y() {
    return this.posY;
  }

  get w() {
    return this.width;
  }

  get h() {
    return this.height;
  }
}
