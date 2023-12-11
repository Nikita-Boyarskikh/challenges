import itertools
from typing import Optional, List, Dict, Tuple
from dataclasses import dataclass, field
from bisect import bisect_left, insort
from enum import StrEnum


class Operation(StrEnum):
    ADD = 'ADD'
    GET = 'GET'
    DELETE = 'DELETE'
    SHOW_OPERATIONS = 'SHOW_OPERATIONS'


class DeleteResult(StrEnum):
    DELETED = 'DELETED'
    NOT_FOUND = 'NOT FOUND'


class BetType(StrEnum):
    BUY = 'BUY'
    SELL = 'SELL'

    @property
    def opposite(self):
        return {
            BetType.BUY: BetType.SELL,
            BetType.SELL: BetType.BUY,
        }[self]


@dataclass(slots=True)
class Bet:
    type_: BetType
    price: float
    amount: int
    id_: int = field(default_factory=itertools.count(1).__next__)

    def __str__(self) -> str:
        return f'{self.id_} {self.type_} {self.price:.2f} {self.amount}'


@dataclass(slots=True)
class HistoryItem:
    buy_id: int
    sell_id: int
    price: float
    amount: int

    def __str__(self) -> str:
        return f'{self.buy_id} {self.sell_id} {self.price:.2f} {self.amount}'


@dataclass(slots=True)
class History:
    _operations: List[HistoryItem] = field(default_factory=list)

    def get(self, last: int) -> List[HistoryItem]:
        assert last > 0
        return self._operations[-last:]

    def add(self, operation: HistoryItem) -> None:
        self._operations.append(operation)


@dataclass(slots=True)
class Exchange:
    _history: History = field(default_factory=History)
    _queue: Dict[BetType, List[Bet]] = field(default_factory=lambda: {
        bet_type: [] for bet_type in BetType
    })
    _bet_index: Dict[int, Bet] = field(default_factory=dict)

    def get(self) -> List[Bet]:
        buy_sort_key = lambda x: (-x.price, x.id_)
        return (
            self._queue[BetType.SELL][::-1]
            + sorted(self._queue[BetType.BUY][::-1], key=buy_sort_key)
        )

    def add(self, bet_type: BetType, price: float, amount: int) -> Bet:
        assert bet_type in BetType
        assert price > 0
        assert amount > 0
        bet = Bet(type_=bet_type, price=price, amount=amount)

        should_clear_queue = False
        find_match = {
            BetType.BUY: self._find_sell,
            BetType.SELL: self._find_buy,
        }[bet.type_]
        while len(self._queue[bet.type_.opposite]) > 0:
            match = find_match(bet)
            if not match:
                break

            self._perform_deal(bet, match)
            if match.amount == 0:
                should_clear_queue = True
            if bet.amount == 0:
                self._clear_queue(bet.type_)
                break

        if should_clear_queue:
            self._clear_queue(bet.type_.opposite)

        if bet.amount > 0:
            self._bet_index[bet.id_] = bet
            insort(self._queue[bet.type_], bet, key=lambda x: x.price)

        return bet

    def _perform_deal(self, buy: Bet, sell: Bet) -> None:
        if buy.type_ != BetType.BUY:
            buy, sell = sell, buy

        assert buy.type_ == BetType.BUY
        assert sell.type_ == BetType.SELL

        price = buy.price if buy.id_ < sell.id_ else sell.price
        amount = min(buy.amount, sell.amount)

        def decrease_amount(bet: Bet) -> None:
            bet.amount -= amount
            if bet.amount == 0 and bet.id_ in self._bet_index:
                del self._bet_index[bet.id_]

        decrease_amount(sell)
        decrease_amount(buy)

        self._history.add(HistoryItem(
            buy_id=buy.id_,
            sell_id=sell.id_,
            price=price,
            amount=amount,
        ))

    def _find_sell(self, bet: Bet) -> Optional[Bet]:
        assert bet.type_ == BetType.BUY
        queue = self._queue[BetType.SELL]

        def search_not_deleted(idx: int) -> Optional[Bet]:
            while (
                idx + 1 < len(queue)
                and queue[idx].id_ not in self._bet_index
            ):
                if queue[idx + 1].price > queue[idx].price:
                    return
                idx += 1
            if idx == len(queue) - 1 and queue[idx].id_ not in self._bet_index:
                return
            return queue[idx]

        def traverse_back(idx: int) -> int:
            while idx - 1 >= 0 and queue[idx - 1].price == queue[idx].price:
                idx -= 1
            return idx

        idx = bisect_left(queue, bet.price, key=lambda x: x.price)
        if idx == 0 and queue[idx].price > bet.price:
            return
        while idx == len(queue):
            idx = traverse_back(idx - 1)

        while True:
            match = search_not_deleted(idx)
            if match:
                return match
            if idx == 0:
                return
            idx = traverse_back(idx - 1)

    def _find_buy(self, bet: Bet) -> Optional[Bet]:
        assert bet.type_ == BetType.SELL
        queue = self._queue[BetType.BUY]

        idx = bisect_left(queue, bet.price, key=lambda x: x.price)
        while idx < len(queue) and (
            queue[idx].price < bet.price or queue[idx].id_ not in self._bet_index
        ):
            idx += 1

        if idx == len(queue):
            return
        return queue[idx]

    def get_operations(self, last: int) -> List[HistoryItem]:
        return self._history.get(last)

    def delete(self, bet_id: int) -> DeleteResult:
        bet = self._bet_index.get(bet_id)
        if bet is None:
            return DeleteResult.NOT_FOUND

        del self._bet_index[bet.id_]
        self._clear_queue(bet.type_)
        return DeleteResult.DELETED

    def _clear_queue(self, bet_type: BetType) -> None:
        self._queue[bet_type] = [
            x for x in self._queue[bet_type]
            if x.id_ in self._bet_index
        ]


class Program:
    @staticmethod
    def add(exchange: Exchange, bet_type: str, price: str, amount: str):
        bet = exchange.add(BetType(bet_type), float(price), int(amount))
        print(bet.id_)

    @staticmethod
    def get(exchange: Exchange):
        for bet in exchange.get():
            print(bet)

    @staticmethod
    def delete(exchange: Exchange, bet_id: str):
        result = exchange.delete(int(bet_id))
        print(result)

    @staticmethod
    def show_operations(exchange: Exchange, last: str):
        for operation in exchange.get_operations(int(last)):
            print(operation)

    @staticmethod
    def start() -> None:
        n = int(input())
        exchange = Exchange()
        for _ in range(n):
            str_op, *args = input().split(' ')
            operation = Operation(str_op)
            {
                Operation.ADD: Program.add,
                Operation.GET: Program.get,
                Operation.DELETE: Program.delete,
                Operation.SHOW_OPERATIONS: Program.show_operations,
            }[operation](exchange, *args)


if __name__ == '__main__':
    Program.start()
