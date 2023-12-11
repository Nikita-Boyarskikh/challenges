import math


def main():
    n = int(input())
    files = [0]
    for f in map(int, input().split(' ')):
        files.append(files[-1] + f)

    stepb = 100 / files[-1]

    prev = 0
    for file in files[1:]:
        diff = file - prev
        step = 100 / diff
        print('AAAA', file, step, stepb)

        b = prev * stepb
        a = 0
        print('AAAA', a, b)

        start = (b // step) * step;
        end = ((file * stepb) // step) * step
        while a <= 100:
            f_a = math.floor(a)
            f_b = math.floor(b)
            if f_a == f_b:
                print(f_a)
                pass
            a += step
            b += stepb
        prev = file
main()
