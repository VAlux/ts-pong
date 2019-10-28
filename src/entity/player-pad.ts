import {Movable} from './movable';
import {Pad} from './pad';

export class PlayerPad extends Pad implements Movable {

  constructor(protected posX: number,
              protected posY: number,
              protected width: number,
              protected height: number,
              private playerPadSpeed: number) {
                
    super(posX, posY, width, height);
  }

  public moveUp() {
    this.moveTo(0, -this.playerPadSpeed);
  }

  public moveDown() {
    this.moveTo(0, this.playerPadSpeed);
  }

  public moveTo(dx: number, dy: number): void {
    this.velocityX += dx;
    this.velocityY += dy;
  }
}
