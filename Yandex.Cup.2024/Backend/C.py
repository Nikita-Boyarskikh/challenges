def readline():
	return list(map(int, input().split(' ')))


n, h = readline()
l = readline()

stacks = defaultdict(dict)

for i, li in enumerate(l):
	for j in range(li):
		stacks[i][j] = readline()[1:]
