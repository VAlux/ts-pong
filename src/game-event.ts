import {TypedEventEmitter} from "./typed-event-kit";

enum Keys {
  Up = 83,
  Down = 87
}

export enum MoveActionEvent {
  MOVE_UP,
  MOVE_DOWN
}

export enum ScoreActionEvent {
  LEFT_PLAYER_SCORED,
  RIGHT_PLAYER_SCORED
}

export class InputEventListener {
  private readonly actionEventEmitter: TypedEventEmitter<MoveActionEvent>;

  constructor() {
    this.actionEventEmitter = new TypedEventEmitter<MoveActionEvent>()
  }

  public registerKeyboardEventListener() {
    document.addEventListener('keydown', (event) => this.handleKeyPressEvent(event));
  }

  private handleKeyPressEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case Keys.Up:
        this.actionEventEmitter.emit(MoveActionEvent.MOVE_UP);
        break;
      case Keys.Down:
        this.actionEventEmitter.emit(MoveActionEvent.MOVE_DOWN);
        break;
    }
  }

  public get eventEmitter(): TypedEventEmitter<MoveActionEvent> {
    return this.actionEventEmitter;
  }
}
