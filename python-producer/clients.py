import socket
import argparse
from typing import Callable
import asyncio
import json
import random

class FakeClient:
    FAMILIES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    EXTRA_TELEMETRY_CYCLE = 10

    def __init__(self, index: int, send_function: Callable):
        self.send = send_function
        self.position = [index, index + 1, index + 2]
        self.name = self.__generate_name(index)
        self.versions = {
            "firmware": "1.2.3",
            "pcb": "2.3.4"
        }
        self.config = {
            "gps": True,
            "imu": True,
            "magnetometer": False
        }

    async def run(self):
        loop_index = 0
        latest_extra_telemetry = -FakeClient.EXTRA_TELEMETRY_CYCLE

        # Wait a random time between 0 and 1sec before starting
        await asyncio.sleep(random.random())

        while True:
            # Move position randomly on each axis
            self.position = [p + random.uniform(-0.5, 0.5) for p in self.position]

            telemetry = {
                "name": self.name,
                "position": self.position
            }

            # Populate telemetry with extra data once in a while
            if loop_index - latest_extra_telemetry >= FakeClient.EXTRA_TELEMETRY_CYCLE:
                telemetry["versions"] = self.versions
                telemetry["config"] = self.config
                latest_extra_telemetry = loop_index

            self.send(telemetry)

            # Wait 1 or 2 seconds
            sleep_time = 1 + random.randrange(2)
            await asyncio.sleep(sleep_time)

            loop_index += sleep_time

    @staticmethod
    def __generate_name(i):
        letters_count = len(FakeClient.FAMILIES)
        family = ""
        family_index = i // 100
        while family_index >= letters_count:
            family += FakeClient.FAMILIES[family_index % letters_count]
            family_index -= letters_count

        family += FakeClient.FAMILIES[family_index]

        return family + str(i % 100).rjust(2, '0')


class ClientsSimulator:
    def __init__(self, server_ip: str, server_port: int, clients_count: int):
        # UDP socket setup
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, 0)
        self.server_ip = server_ip
        self.server_port = server_port

        # Clients instantiation
        self.clients = [FakeClient(i, self.send_data) for i in range(clients_count)]

    def __del__(self):
        print("Closing clients")
        self.socket.close()

    def send_data(self, data):
        # We use the same socket for all fake clients
        self.socket.sendto(json.dumps(data).encode('utf-8'), (self.server_ip, self.server_port))

    def run(self):
        print("Starting clients... (Ctrl+C to quit)")
        asyncio.run(self._run())

    async def _run(self):
        await asyncio.gather(
            *[c.run() for c in self.clients]
        )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Basic clients simulator.')
    parser.add_argument('server_ip', type=str)
    parser.add_argument('server_port', type=int)
    parser.add_argument('clients_count', type=int)

    args = parser.parse_args()

    simulator = ClientsSimulator(args.server_ip, args.server_port, args.clients_count)
    simulator.run()