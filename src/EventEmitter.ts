export type EventLike = { type: string; };
export type EventListener<E extends EventLike> = (e: E) => void;

export type EventMap = {
    [type: string]: EventListener<Event>;
};

export type EventType<T> = {
    [K in keyof T]: T[K] extends EventListener<infer E> ? E : never;
}[keyof T];

export type ListenerMap<T> = {
    [K in keyof T]: T[K][];
};

/**
 * 自定义事件触发器
 */
export default class EventEmitter<T extends {} = EventMap>/**  implements EventTarget */ {

    private listeners: ListenerMap<T> = {} as any;

    addEventListener<K extends keyof T>(type: K, listener: T[K]) {
        const listeners = this.getListerers(type);
        if (!listeners.includes(listener)) {
            listeners.push(listener);
        }
    }

    dispatchEvent<E extends EventType<T>>(event: E): boolean {
        try {
            for (const listener of this.getListerers(event.type as keyof T)) {
                (listener as any)(event);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    removeEventListener<K extends keyof T>(type: K, callback: T[K]) {
        const listeners = this.getListerers(type);
        let i = -1;
        if ((i = listeners.indexOf(callback)) != -1) {
            listeners.splice(i, 1);
        }
    }

    clearListeners() {
        this.listeners = {} as any;
    }

    private getListerers<K extends keyof T>(type: K) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        return this.listeners[type];
    }

}