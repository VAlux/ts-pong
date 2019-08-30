import {Movable} from "./movable";
import {Pad} from "./pad";

export class PlayerPad extends Pad implements Movable {

  public moveTo(dx: number, dy: number): void {
    this.velocityX += dx;
    this.velocityY += dy;
  }


}
