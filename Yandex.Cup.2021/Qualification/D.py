import math

n, m = [int(x) for x in input().split(' ')]
arr = [
  [j * m + i + 1 for i in range(m)] for j in range(n)
]

s = set(x + 1 for x in range(n * m))

for _ in range(int(math.log2(n * m))):
  print(arr)
  if m > n:
    for j in range(n):
      for i in range(m // 2):
        arr[j][i] += arr[j][m-i-1]
        s.add(arr[j][i])
      arr[j] = arr[j][:m // 2]
    m //= 2
  else:
    for i in range(m):
      for j in range(n // 2):
        arr[j][i] += arr[n-j-1][i]
        s.add(arr[j][i])
    arr = arr[:n // 2]
    n //= 2

print(len(s))