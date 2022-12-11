import prisma from "../utils/prisma.singleton.js";
import { BufferItems } from "src/modules/drone/drone.type.js";

export const storeDronePositions = async (input: Iterable<BufferItems>) => {
  [...input].forEach(async ([name, positions]) => {
    const existingDrone = await prisma.drone.findFirst({ where: { name } });
    const data = positions.map(({ time, position }) => ({
      time,
      coordinates: position,
    }));
    if (!existingDrone?.name) {
      const addDrones = await prisma.drone.create({
        data: { name, positions: { createMany: { data } } },
      });
      console.log(addDrones);
    } else {
      data.forEach(async ({ time, coordinates }) => {
        const addPositions = await prisma.position.create({
          data: { droneName: name, time, coordinates },
        });
        console.log(addPositions);
      });
    }
  });
};
