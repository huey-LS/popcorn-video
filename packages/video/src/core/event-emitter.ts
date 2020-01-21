import { respond } from '../shared/spread';

import {
  enumerable,
  writable
} from '../shared/descriptors';

export const WILL_DESTROY = 'willDestroy';
export const DID_DESTROY = 'didDestroy';

export class Event<DataType = any> {
  data: DataType;
  target: any;
  type: string;
  origin?: Event<DataType>;

  constructor (
    options: {
      data: any,
      target: any,
      type: string
    }
  ) {
    const { data, target, type } = options;
    this.data = data;
    this.target = target;
    this.type = type;

    return this;
  }
}

export interface TypedEventCallback<TypedEvent extends Event = Event> {
  (event: TypedEvent): void;
}

export interface CommonEventConfig {
  [WILL_DESTROY]: TypedEventCallback,
  [DID_DESTROY]: TypedEventCallback
}

interface EventCallbacksByType {
  [type: string]: TypedEventCallback[];
}

export class EventEmitter<EventsConfig extends CommonEventConfig = CommonEventConfig> {
  static isEvent = function (obj: any): obj is Event {
    return obj &&
      (
        obj instanceof Event
        || obj.__cherry_tomato_event
      )
  }

  readonly __cherry_tomato_event = true;

  @enumerable(false)
  @writable(true)
  _events: EventCallbacksByType;

  @enumerable(false)
  @writable(true)
  _all_events: TypedEventCallback[]

  @enumerable(false)
  @writable(true)
  _destroyed: boolean;

  constructor () {
    this._events = {};
    this._all_events = [];
    this._destroyed = false;
  }

  emit (name: Event|keyof EventsConfig, data?: any, originEvent?: Event) {
    let event: Event;
    if (EventEmitter.isEvent(name)) {
      event = name;
    } else {
      event = new Event({
        target: this,
        data,
        type: name as string
      });
    }
    if (originEvent) {
      event.origin = originEvent;
    }

    let type = event.type;
    let events = this._events[type];
    if (events) {
      events.forEach((callback) => {
        callback(event);
      })
    }

    this._all_events.forEach((callback) => {
      callback(event);
    })
  }

  addAllListener (callback: TypedEventCallback) {
    let removeListener = () => {};
    if (callback) {
      let events = this._all_events;
      events.push(callback);
      removeListener = () => {
        this.removeAllListener(callback);
      }
    }
    return removeListener;
  }

  removeAllListener (callback: TypedEventCallback) {
    if (this._destroyed) return false;
    let events = this._all_events;
    this._removeEventCallback(events, callback);
    return callback;
  }

  addListener<K extends keyof EventsConfig>(name: K, callback: EventsConfig[K]) {
    let removeListener = () => {};
    if (this._destroyed) return removeListener;
    if (callback) {
      let events = this._events[name as string];
      if (!events) events = this._events[name as string] = [];
      events.push(callback as any);
      removeListener = () => {
        this.removeListener(callback as any);
      }
    }
    return removeListener;
  }

  once<K extends keyof EventsConfig>(name: K, callback: EventsConfig[K]) {
    if (!callback) return;
    let removeListener: () => void;
    const autoRemoveCallback: any = (event: any) => {
      removeListener && removeListener();
      if (callback) {
        (callback as any)(event);
      }
    }
    removeListener = this.addListener(name, autoRemoveCallback);
  }

  removeListener (callback: TypedEventCallback) {
    if (this._destroyed) return false;
    let events = this._events;
    Object.keys(events).forEach((key) => {
      this._removeEventCallback(events[key], callback);
    })

    return callback;
  }

  _removeEventCallback (events: TypedEventCallback[], callback: TypedEventCallback) {
    let index = events.findIndex((fn) => (fn === callback));
    if (index > -1) {
      events.splice(index, 1);
      return callback;
    }
  }

  destroy () {
    respond(WILL_DESTROY, this);
    this._events = {};
    this._all_events = [];
    this._destroyed = true;
    respond(DID_DESTROY, this);
  }
}
