import { Drone } from '../drone/drone.type.js';
import { createSocket } from 'dgram';
import type { BufferInteractor } from './buffer.interactor.js';

export class UDPInteractor {
  private cacheProvider: BufferInteractor;
  private socket;
  private controller = new AbortController();
  constructor() {
    const { signal } = this.controller;
    this.socket = createSocket({ type: 'udp4', signal });
  }
  bindBuffer(cacheProvider: BufferInteractor) {
    this.cacheProvider = cacheProvider;
    this.socket.on('message', (msg: string, rinfo) => {
      const message: Drone = JSON.parse(msg);
      this.cacheProvider.addItems({ ...rinfo, ...message });
    });
  }
  startConnection({ port, host }: { port: number; host?: string }) {
    this.socket.bind(port, host);
    return this.socket;
  }
  stopConnection() {
    this.controller.abort();
    return this.socket;
  }
}
