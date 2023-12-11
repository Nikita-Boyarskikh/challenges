def get_res(ratings):
	return ratings + len(ratings)


n = int(input())
ratings = map(int, input().split(' '))
prev = 0
for _ in range(int(input()):
	l, r = map(int, input().split(' '))
	real_l = (l + prev) % n
	real_r = (r + prev) % n
	if real_l > real_r:
		real_l, real_r = real_r, real_l
	prev = get_res(ratings[real_l, real_r])
	print(prev)
