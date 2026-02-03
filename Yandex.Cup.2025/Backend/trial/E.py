import asyncio
import functools
import operator
import urllib.parse

import aiohttp
import json
import enum

PATH = 'code'
TIMEOUT = 1


class Operation(enum.StrEnum):
    OR = '|'
    AND = '&'
    CALL = 'call'


class CarpetProcessor:
    def __init__(self, config):
        self.config = config
        self.cache = {}
        self.session = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT))

    async def _fetch(self, server):
        if server not in self.cache:
            self.cache[server] = asyncio.create_task(self._do_request(server))
        return await self.cache[server]

    async def _do_request(self, server):
        try:
            async with self.session.get(urllib.parse.urljoin(server, PATH)) as resp:
                return int(await resp.text())
        except asyncio.TimeoutError:
            return None

    async def _run_all_children(self, children):
        tasks = (self._run_operation(child) for child in children)
        results = await asyncio.gather(*tasks)
        return [res for res in results if res is not None]

    async def _run_operation(self, node):
        match node['operation']:
            case Operation.OR:
                results = await self._run_all_children(node['children'])
                return functools.reduce(operator.ior, results) if results else None
            case Operation.AND:
                results = await self._run_all_children(node['children'])
                return functools.reduce(operator.iand, results) if results else None
            case Operation.CALL:
                return await self._fetch(node['backend'])

    def clear_cache(self):
        for task in self.cache.values():
            task.cancel()
        self.cache.clear()

    async def get_result(self):
        self.clear_cache()
        return await self._run_operation(self.config['result'])

    async def shutdown(self):
        await self.session.close()


class Command(enum.StrEnum):
    SHUTDOWN = 'SHUTDOWN'
    NEXT = 'NEXT'


class Response(enum.StrEnum):
    OK = 'OK'
    ERROR = 'ERROR'


def read_config():
    result = json.loads(input())
    print(Response.OK)
    return result


async def main():
    processor = CarpetProcessor(read_config())
    while True:
        command = input()
        match command:
            case Command.SHUTDOWN:
                await processor.shutdown()
                print(Response.OK)
                return
            case Command.NEXT:
                result = await processor.get_result()
                print(result if result is not None else Response.ERROR)


if __name__ == '__main__':
    asyncio.run(main())