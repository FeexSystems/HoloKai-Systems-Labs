type EventCallback<T = any> = (data: T) => void;

/**
 * Lightweight, pub/sub Event Bus for cross-Micro-Frontend communication.
 */
export class HoloKaiEventBus {
  private static instance: HoloKaiEventBus;
  private listeners: Map<string, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): HoloKaiEventBus {
    if (!HoloKaiEventBus.instance) {
      HoloKaiEventBus.instance = new HoloKaiEventBus();
    }
    return HoloKaiEventBus.instance;
  }

  public subscribe<T = any>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  public publish<T = any>(event: string, data: T): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => {
        try {
          callback(data);
        } catch (err) {
          console.error(`[HoloKai EventBus] Error in listener for event "${event}":`, err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = HoloKaiEventBus.getInstance();
