export type Listener<T> = (event: T) => any;

export interface DisposableEvent {
  dispose(): void;
}

export class TypedEventEmitter<T> {
  private listeners: Array<Listener<T>>;

  constructor() {
    this.listeners = [];
  }

  public on = (listener: Listener<T>): DisposableEvent => {
    this.listeners.push(listener);
    return {
      dispose: () => this.off(listener),
    };
  };

  public off = (listener: Listener<T>): void => {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  };

  public emit = (event: T) => {
    this.listeners.forEach((listener) => listener(event));
  }
}
