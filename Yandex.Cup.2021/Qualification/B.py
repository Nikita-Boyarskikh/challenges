from enum import Enum, auto
from collections import Counter


class Cell(Enum):
  WWWW = auto()
  RRRR = auto()
  BBBB = auto()
  BBBR = auto()
  BBBW = auto()
  RRRB = auto()
  RRRW = auto()
  WWWR = auto()
  WWWB = auto()
  WWBB = auto()
  WWRR = auto()
  RRBB = auto()
  WBBW = auto()
  BRRB = auto()
  WRRW = auto()
  BBWR = auto()
  BBRW = auto()
  WWRB = auto()
  WWBR = auto()
  RRBW = auto()
  RRWB = auto()
  WRBW = auto()
  WBRW = auto()
  RBWR = auto()
  RWBR = auto()
  BRWB = auto()
  BWRB = auto()


def get_cell_enum(cell_str):
  for _ in range(len(cell_str)):
    try:
      return Cell[cell_str]
    except:
      pass
    cell_str = cell_str[2] + cell_str[0] + cell_str[3] + cell_str[1]


def check_image():
  cells = Counter()
  cells_num = int(input())
  for _ in range(cells_num):
    cell_str = input()
    cell_str += input()
    cell = get_cell_enum(cell_str)
    cells[cell] += 1

  y, x = [int(x) for x in input().split(' ')]
  image = ''
  for _ in range(y):
    image += input()

  for j in range(y // 2):
    for i in range(x // 2):
      idx = j * 2 * x + i * 2
      cell = get_cell_enum(image[idx:idx+2] + image[idx+x:idx+x+2])
      if cells[cell] == 0:
        return False
      cells[cell] -= 1
  return True


print('Yes' if check_image() else 'No')