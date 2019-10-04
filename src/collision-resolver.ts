import {PhysicalEntity} from './entity/physical-entity';

export enum CollisionDirection {
  NO_COLLISION,
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

export class CollisionResolver {

  constructor(private readonly entities: PhysicalEntity[]) { }

  public resolveCollisions(): void {
    for(let i = 0; i < this.entities.length; i++) {
      const subject = this.entities[i];
      for (let j = 0; j < this.entities.length; j++) {
        const target = this.entities[j];
        if (i !== j) {
          subject.resolveCollisionWith(target, subject.checkCollisionWith(target));
        }
      }
    }
  }
}
