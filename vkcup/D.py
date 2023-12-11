from dataclasses import dataclass
from collections import defaultdict


SUITS = ('C', 'D', 'S', 'H')
VALUES = ('6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A')
reverse_values_map = {}
for i, val in enumerate(VALUES):
	reverse_values_map[val] = i


@dataclass(slots=True, order=True)
class PlayerSuit:
	middle: int = 0
	total: int = 0
	left: int = 0
	right: int = 0
	name: str


def get_player_state():
    res = defaultdict(set)
    for value, suit in input().split(' '):
        res[suit].add(value)
    return res


def step(player, player_suits, state):
	for suit in sorted(player_suits):
		middle = len(VALUES) // 2
		player_suit = player[suit.name]

		if middle_val in player_suit:
			state[suit.name] = [middle, middle]
			player_suit.remove(VALUES[middle])
			return 1

		if suit.left >= suit.right:
			from_i, to_i = state[suit.name]
			down = from_i - 1
			if down > 0 and down in player_suit:
				state[suit.name] = [down, to_i]
				player_suit.remove(VALUES[down])
				return 1

		up = to_i + 1
		if up < len(VALUES) and up in player_suit:
			state[suit.name] = [from_i, up]
			player_suit.remove(VALUES[up])
			return 1

	return 0


def get_suits(player):
	middle = len(VALUES) // 2
	middle_val = VALUES[middle]
	for suit, values in player.items():
		for val in values:
			if val == middle_val:

		suit: PlayerSuit() for suit in SUITS}



def game(players):
	cards = len(SUITS) * len(VALUES)
	state = {}
	stat = [None] * len(players)
	while True:
		for i, player in enumerate(players):
			if not suits[i]:
				suits[i] = get_suits(player)
			cards -= step(player, suits[i], state)
			if not cards:
				return i


alice = get_player_state()
bob = get_player_state()
winner = game([alice, bob])
if winner == 0:
	print('Alice')
else:
	print('Bob')
