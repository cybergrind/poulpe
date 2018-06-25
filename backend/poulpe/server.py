import asyncio
import logging
import json
import time
from sanic import Sanic
from sanic import response


PING_LOOP = 5


def index(request):
    return response.text('Ok')


class SessionWorker:
    log = logging.getLogger('SessionWorker')

    def __init__(self, request, ws, loop=None):
        self.loop = loop or asyncio.get_event_loop()
        self.ws = ws
        self.ping_loop = self.loop.create_task(self.ping_loop())
        self.read_loop = self.loop.create_task(self.read_loop())
        self.done = self.loop.create_future()

    async def read_loop(self):
        while True:
            data = await self.ws.recv()
            self.log.info(f'Got msg: {data}')

    async def ping_loop(self):
        c = 0
        while True:
            c += 1
            msg = {'msg_type': 'ping', 'body': time.time()}
            await self.ws.send(json.dumps(msg))
            await asyncio.sleep(PING_LOOP)
            if c >= 2:
                print('Close')
                await self.ws.close()
                await self.stop()
                break

    async def stop(self):
        if not self.ping_loop.done():
            self.ping_loop.cancel()
        if not self.read_loop.done():
            self.read_loop.cancel()
        self.done.set_result(True)


async def websocket(request, ws):
    await SessionWorker(request, ws, loop=request.app.loop).done


def get_app():
    app = Sanic()
    app.add_route(index, '/')
    app.add_websocket_route(websocket, '/ws')
    return app


def run_server(host='0.0.0.0', port=9011):
    get_app().run(host, port)
