def main():
    n = int(input())
    nums = sorted(map(int, input().split(' ')), reverse=True)
    for i, x in enumerate(nums):
        if x < (i + 1) ** 2:
            return i
    return n

print(main())
