import {Pad} from "./pad";
import {Ball} from "./ball";

export class EnemyPad extends Pad {

  private readonly ball: Ball;
  private readonly iqLevel = 0.7; // below 0.5

  constructor(protected posX: number,
              protected posY: number,
              protected width: number,
              protected height: number,
              ball: Ball) {

    super(posX, posY, width, height);

    this.ball = ball;
  }


  act(): void {
    // Fucking unbeatable AI system.
    if (this.ball.y > this.y + this.height) {
      this.velocityY += this.iqLevel;
    }

    if (this.ball.y < this.y) {
      this.velocityY -= this.iqLevel;
    }

    super.act();
  }
}