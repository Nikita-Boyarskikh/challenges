from dataclasses import dataclass
from typing import Dict, Iterable

@dataclass(slots=True)
class Token[T]:
  type_: T
  value: str


class Tokenizer[T]:
  _position: int = 0

  def __init__(self, parsers: Dict[T, Parser]):
    self.parsers = parsers
    self.reset()
  
  def reset(self):
    self._position = 0
  
  @property
  def position(self):
    return self._position

  def tokenize(self, text: str) -> Iterable[Token[T]]:
    for token_type, parser in self.parsers.items():
      for token in parser(self, text):
        yield Token(token_type, token)
