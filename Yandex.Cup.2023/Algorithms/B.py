def minmax(arr, m):
	min_diff = float('inf')
	prev_i = arr[0]
	for i in arr[1:]:
		diff = abs(i - prev_i)
		if diff < m:
			return m
		if diff < min_diff:
			min_diff = diff
		prev_i = i
	return min_diff


def get_nums():
	return map(int, input().split(' '))


n, m = get_nums()
cs = sorted(enumerate(get_nums()), key=lambda x: x[1])

diff = minmax([x[0] for x in cs[:m]] + [x[0] for x in cs[m:] if x[1] == cs[m - 1][1]], m)
print(diff + 1)
