from heapq import heappush


n = int(input())
x_heap = []
y_heap = []
for _ in range(n):
	t, a = input().split(' '); a = int(a)
	if t == 'U' or t == 'D':
		heappush(y_heap, (a, t))
	else:
		heappush(x_heap, (a, t))

max_l = 0
level = 0
for a, t in x_heap:
	if t == 'R':
		level += 1
	if t == 'L':
		level -= 1
	max_l = max(max_l, level)

print(max_l * 2 - level)

max_l = 0
level = 0
for a, t in y_heap:
	if t == 'U':
		level += 1
	if t == 'D':
		level -= 1
	max_l = max(max_l, level)

print(max_l * 2 - level)
