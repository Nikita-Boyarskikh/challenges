nums = list(int(i) for i in input().split())
n = int(input())
for _ in range(n):
    c = 0
    for i in input().split():
        i = int(i)
        if i in nums:
            c += 1
    if c >= 3:
        print('Lucky')
    else:
        print('Unlucky')
