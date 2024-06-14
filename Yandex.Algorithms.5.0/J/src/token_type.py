from enum import Enum


class TokenType(Enum):
  NEW_LINE = '\n'
  SPACE = ' '
  WORD = 'word'
  IMAGE = '(image ...)'
