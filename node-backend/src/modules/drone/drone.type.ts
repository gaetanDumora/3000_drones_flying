import { RemoteInfo } from 'dgram';

type Version = { firmware: string; pcb: string };
type Config = { gps: boolean; imu: boolean; magnetometer: boolean };
type Position = [number, number, number];

export interface Drone extends RemoteInfo {
  versions?: Version;
  config?: Config;
  name: string;
  position: Position;
}

export type BufferItems = [string, { time: number; position: Position }[]];
