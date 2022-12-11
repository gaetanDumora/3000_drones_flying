import * as dotenv from "dotenv";
dotenv.config();
import { BufferInteractor } from "./modules/interactors/buffer.interactor.js";
import { UDPInteractor } from "./modules/interactors/udp.interactor.js";
import { storeDronePositions } from "./modules/drone/drone.service.js";

export const main = async () => {
  const port = Number(process.env.UDP_PORT);
  const host = process.env.UDP_HOST;
  // Flush buffer every X secondes
  const TTL = 1000 * 5;
  // Initialize buffer mechanism
  const bufferMemory = new BufferInteractor(TTL);
  // Initialize UDP connection
  const server = new UDPInteractor();
  try {
    server.bindBuffer(bufferMemory);
    server.startConnection({ port, host });
    bufferMemory.on("flush", () =>
      storeDronePositions(bufferMemory.getItems())
    );
    console.log({ serverUDP: true });
  } catch (error) {
    console.error(error);
    server.stopConnection();
  }
};

main();
