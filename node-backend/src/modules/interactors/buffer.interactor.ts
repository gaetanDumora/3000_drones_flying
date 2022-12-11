import EventEmitter from 'node:stream';
import { BufferItems, Drone } from '../drone/drone.type.js';

// Simple Buffer mechanism using ES6 Map
export class BufferInteractor extends EventEmitter {
  readonly buffer = new Map();
  constructor(ttl: number) {
    super();
    this.startBufferTimer(ttl);
  }
  private startBufferTimer(ttl: number) {
    setTimeout(() => {
      this.flushBuffer();
      return this.startBufferTimer(ttl);
    }, ttl);
  }
  private flushBuffer() {
    this.emit('flush');
    return this.buffer.clear();
  }
  getItems(): Iterable<BufferItems> {
    return this.buffer.entries();
  }
  addItems(input: Drone) {
    const { name, position } = input;
    const entries = { time: Date.now(), position };
    if (this.buffer.has(name)) {
      this.buffer.get(name).push(entries);
    } else {
      this.buffer.set(name, [entries]);
    }
  }
}
