from string import ascii_lowercase, ascii_uppercase
from enum import Enum, auto


class Case(Enum):
  UPPER = auto()
  LOWER = auto()

  @property
  def other(self):
      return Case.UPPER if self is Case.LOWER else Case.LOWER


CASE_LETTERS_MAP = {
  Case.UPPER: set(ascii_uppercase + ' '),
  Case.LOWER: set(ascii_lowercase + ' '),
}


def check_case(string, case):
  letters = CASE_LETTERS_MAP[case]
  return all(char in letters for char in string)


class WritingMachine:
  def __init__(self):
    self.current_case = Case.LOWER

  def count_key_presses(self, string):
    result = 0
    i = 0

    while i < len(string):
      if check_case(string[i], self.current_case):
        result += 1
        i += 1
      elif check_case(string[i:i+4], self.current_case.other):
        result += 2 + 4
        i += 4
        self.current_case = self.current_case.other
      else:
        result += 2
        i += 1

    return result

ABcDE
abcde
^

[
  [0,  1, 2, 3, 4, 5],
  [12, 13, 14, 15, 16, 17],
]   ^


if __name__ == '__main__':
  string = input()
  wm = WritingMachine()
  result = wm.count_key_presses(string)
  print(result)

