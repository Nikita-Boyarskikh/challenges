def is_amazing(n):
  if n < 10:
    return False
  s = str(n)
  if '00' in s:
    return False
  for a, b in zip(s, s[1:]):
    x = int(a + b)
    if x and n % x > 0:
      return False
    if x:
      n /= x
  return n == 1


cache = {}
n = int(input())
for _ in range(n):
  l, r = map(int, input().split(' '))
  c = 0
  for i in range(l, r + 1):
    if i not in cache:
      if is_amazing(i):
        cache[i] = True
      else:
        cache[i] = False
    if cache[i]:
  	  c += 1
  print(c)
