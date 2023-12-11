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
        return self._operations[-last:]

    def add(self, operation: HistoryItem) -> None:
        self._operations.append(operation)


@dataclass(slots=True)
class Exchange:
    _history: History = field(default_factory=History)
    _bets: List[Bet] = field(default_factory=list)

    def get(self) -> List[Bet]:
        sort_key = lambda x: (-x.price, x.id_) if x.type_ == BetType.BUY else (-x.price, -x.id_)
        return sorted(self._bets, key=sort_key)

    def add(self, bet_type: BetType, price: float, amount: int) -> Bet:
        bet = Bet(type_=bet_type, price=price, amount=amount)

        while len(self._bets) > 0:
            match = self._find_match(bet)
            if not match:
                break

            self._perform_deal(bet, match)
            if bet.amount == 0:
                break

        if bet.amount > 0:
            self._bets.append(bet)

        return bet

    def _perform_deal(self, buy: Bet, sell: Bet) -> None:
        price = buy.price if buy.id_ < sell.id_ else sell.price
        amount = min(buy.amount, sell.amount)

        def decrease_amount(bet: Bet) -> None:
            bet.amount -= amount
            if bet.amount == 0:
                self.delete(bet.id_)

        decrease_amount(sell)
        decrease_amount(buy)

        self._history.add(HistoryItem(
            buy_id=buy.id_,
            sell_id=sell.id_,
            price=price,
            amount=amount,
        ))

    def _find_match(self, bet: Bet) -> Optional[Bet]:
        def traverse_back(idx: int) -> int:
            while idx - 1 >= 0 and queue[idx - 1].price == queue[idx].price:
                idx -= 1
            return idx

        for x in self._bets:
            if x.type_ == bet.type_:
                continue
            if bet.type_ == BetType.BUY and bet.price - x.price < 0:
                continue
            if bet.type_ == BetType.sell and bet.price - x.price < 0:
        mb = min(queue, key=key)
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
        queue = self._queue[BetType.BUY]

        idx = bisect_left(queue, bet.price, key=lambda x: x.price)
        while idx < len(queue) and (
            queue[idx].price < bet.price
        ):
            idx += 1

        if idx == len(queue):
            return
        return queue[idx]

    def get_operations(self, last: int) -> List[HistoryItem]:
        return self._history.get(last)

    def delete(self, bet_id: int) -> DeleteResult:
        if bet_id not in self._bets:
            return DeleteResult.NOT_FOUND

        self._bets = [x for x in self._bets if x.id_ != bet_id]
        return DeleteResult.DELETED

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
