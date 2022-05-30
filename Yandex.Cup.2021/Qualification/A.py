def str_to_num(n):
  i = 0
  result = 0
  while i < len(n):
    result *= 2
    if n[i] == 'o':
      i += 3
      result += 1
    else:
      i += 4
  return result


a_str = input()
b_str = input()

diff = str_to_num(a_str) - str_to_num(b_str)
if diff > 0:
  print('>')
elif diff < 0:
  print('<')
else:
  print('=')