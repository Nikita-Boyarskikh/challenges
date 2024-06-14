from typing import Iterable
from ..tokenizer import Token


class BaseParser(ABC):
    @abstractmethod
    def __call__(self, text: str) -> Iterable[Token]: ...
