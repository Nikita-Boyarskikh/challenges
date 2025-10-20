#!/usr/bin/env python3
import json
import sys
import itertools
import asyncio
import aiohttp
from urllib.parse import urljoin


SALT = 7
CACHE_URLS = None
DB_URL = None

config_filename = sys.argv[1]
with open(config_filename, 'r') as file:
    config = json.load(file)
    DB_URL = config['db_url']
    CACHE_URLS = config['cache_urls']


def hash(s):
    nums = map(ord, s)
    num = (next(nums) * SALT,)
    return (sum(itertools.chain(num, nums)) + SALT) % len(CACHE_URLS)


def get_next_i(i):
    return (i + 1) % len(CACHE_URLS)


async def get_cache(session, i, key):
    if CACHE_URLS[i] is not None:
        url = urljoin(CACHE_URLS[i], key)
        async with session.get(url) as resp:
            if resp.status == 200:
                return await resp.text()
            elif resp.status == 404:
                return None
            elif resp.status == 502:
                CACHE_URLS[i] = None

    next_i = get_next_i(i)
    return await get_cache(session, next_i, key)


async def save_cache(session, i, key, value, retry=False):
    if CACHE_URLS[i] is not None:
        url = urljoin(CACHE_URLS[i], key)
        async with session.put(url, data=value) as resp:
            if resp.status != 200:
                CACHE_URLS[i] = None

    if retry:
        return

    next_i = get_next_i(i)
    await save_cache(session, next_i, key, value, retry=True)


async def get_db(session, key):
    url = urljoin(DB_URL, key)
    async with session.get(url) as resp:
        return await resp.text()


async def get_value(session, key):
    i = hash(key)
    value = await get_cache(session, i, key)
    if value is None:
        value = await get_db(session, key)
        await save_cache(session, i, key, value)
    return value


async def main():
    async with aiohttp.ClientSession() as session:
        while True:
            key = input()
            value = await get_value(session, key)
            print(value, flush=True)

asyncio.run(main())
