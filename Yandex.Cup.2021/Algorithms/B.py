def read_int_array():
  string = input()
  if not string:
    return []
  return [int(x) for x in string.split(' ')]


def check(canonical, fn_result):
  diff_div = None
  for x1, x2, y1, y2 in zip(canonical, canonical[1:], fn_result, fn_result[1:]):
    if x1 == x2 and y1 == y2:
      continue

    if (x1 == x2) != (y1 == y2):
      return False

    current_diff_div = (x1 - x2) / (y1 - y2)
    if diff_div is not None and diff_div != current_diff_div:
      return False
    diff_div = current_diff_div

  return True


def test(canonical, fn_result):
  if len(canonical) != len(fn_result):
    return False

  canonical.sort()
  fn_result.sort()
  neg_fn_result = [-1 * x for x in fn_result[::-1]]
  return check(canonical, fn_result) or check(canonical, neg_fn_result)


if __name__ == '__main__':
  n_tests = int(input())
  for _ in range(n_tests):
    _canonical_str_len = input()
    canonical = read_int_array()
    _fn_result_str_len = input()
    fn_result = read_int_array()
    if test(canonical, fn_result):
      print('YES')
    else:
      print('NO')
