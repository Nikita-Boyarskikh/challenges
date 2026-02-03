from string import digits


class Parser:
  def __init__(self, data):
    self.data = data
    self.result = 0
    self.i = 0
    self.start = 0

  def skip(self):
    self.start = self.i

  def pick(self):
    self.result += self.i - self.start
    self.skip()

  @property
  def done(self):
    return self.i >= len(self.data)

  @property
  def char(self):
    return self.data[self.i]

  def next(self, chars = 1):
    self.i += chars

  def _read_while(self, condition):
    while not self.done and condition():
      self.next()

  def _read_digits(self):
    self._read_while(lambda: self.char in digits)

  def _read_digits_until(self, char):
    start = self.i
    self._read_digits()
    if self.done or self.char != char:
      return
    result = int(self.data[start:self.i])
    self.next()
    return result

  def _read_marker(self):
    assert self.char == '('
    self.next()

    marker_len = self._read_digits_until('x')
    if marker_len is None:
      return

    marker_quantity = self._read_digits_until(')')
    if marker_quantity is None:
      return

    return marker_len, marker_quantity

  def parse(self):
    while not self.done:
      if self.char == '(':
        self.pick()

        marker = self._read_marker()
        if marker is None:
          self.pick()
          continue

        m_len, m_quant = marker
        part = self.data[self.i:self.i + m_len]
        sub_parser = Parser(part)
        self.result += sub_parser.parse() * m_quant
        self.next(m_len)
        self.skip()
        continue
      self.next()
    self.pick()
    return self.result

parser = Parser(input())
print(parser.parse())
