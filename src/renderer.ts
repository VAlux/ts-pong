import {Drawable} from "./entity/drawable";

export class Renderer {
  private readonly context: CanvasRenderingContext2D;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private drawableEntities: Drawable[],
  ) {
    this.context = canvas.getContext('2d')!;
  }

  public render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawableEntities.forEach((drawable) => drawable.draw(this.context));
  }
}
