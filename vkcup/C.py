t = int(input())
for _ in range(t):
    n = int(input())
    commits = map(int, input().split(' '))
    for i, commit in enumerate(commits):
        if commit == prev and not shifted:
            shifted = True
        if commit == prev:
            res += 1
            prev = commit + 1
        elif commit + 1 == prev:
            prev = commit + 1
            shifted = False


