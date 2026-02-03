import math


def lcm(a, b):
    g = math.gcd(a, b)
    # Проверка на переполнение
    if a // g > 10 ** 18 // b:
        return 10 ** 18 + 1  # Больше верхней границы
    return a // g * b


def count_upto(X, a, b, c):
    lab = lcm(a, b)
    lac = lcm(a, c)
    lbc = lcm(b, c)
    labc = lcm(lab, c)

    cnt_ab = X // lab - X // labc
    cnt_ac = X // lac - X // labc
    cnt_bc = X // lbc - X // labc

    return cnt_ab + cnt_ac + cnt_bc


def solve():
    a, b, c = map(int, input().split())
    n = int(input())

    lo, hi = 1, 10 ** 18
    ans = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if count_upto(mid, a, b, c) >= n:
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1

    if ans > 10 ** 18:
        print(-1)
    else:
        print(ans)


if __name__ == "__main__":
    solve()