import {Ball} from './ball';
import {Pad} from './pad';

export class EnemyPad extends Pad {

  private readonly ball: Ball;
  private readonly iqLevel = 0.7; // below 0.5 you will play with autistic enemy...

  constructor(protected posX: number,
              protected posY: number,
              protected width: number,
              protected height: number,
              ball: Ball) {

    super(posX, posY, width, height);

    this.ball = ball;
  }

  public act(): void {
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
