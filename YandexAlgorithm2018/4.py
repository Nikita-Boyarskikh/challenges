import sys
from heapq import heappush

n, q = list(int(i) for i in input().split())
l = list(int(i) for i in input().split())
idxs = []

for ipt in sys.stdin:
    ok = False
    left, right = list(int(i) for i in ipt.split())
    j = 0
    while j < len(idxs) and left > idxs[j][0]:
        if right < idxs[j][1]:
            print(' '.join(str(i) for i in idxs[j][2:]))
            ok = True
        j += 1
    if not ok and right - left >= 2:
        lst = l[left-1:right]
        a, b, c = lst[0], lst[1], lst[2]
        ia, ib, ic = 0, 1, 2
        i = 3
        while i < len(lst):
            o = lst[i]
            if o > c:
                c, b, a = o, c, b
                ic, ib, ia = i, ic, ib
            elif o > b:
                b, a = o, b
                ib, ia = i, ib
            elif o > a:
                a = o
                ia = i
            i += 1
        (a, ia), (b, ib), (c, ic) = sorted(list(zip((a, b, c), map(lambda i: i+left, (ia, ib, ic)))))
        if a + b > c and ia != ib and ib != ic and ia != ic:
            heappush(idxs, [left, right, ia, ib, ic])
            print(ia, ib, ic)
        else:
            print(-1)
    elif not ok:
        print(-1)
