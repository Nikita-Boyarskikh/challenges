HEIGHT = 10
WIDTH = 4

SCROLL_SIZES = (
    (1,1),
    (1,2),
    (1,3),
    (1,4),
    (2,2),
    (2,3),
    (2,4),
    (3,3),
)
class Visited: pass
VISITED = Visited()


def read_wall():
    wall = [None] * HEIGHT
    for i in range(HEIGHT):
        wall[i] = list(map(int, input().split()))
    return wall


def iterate_scroll(wall, y, x):
    scroll_type = wall[y][x]
    h, w = SCROLL_SIZES[scroll_type - 1]
    for i in range(y, y + h):
        for j in range(x, x + w):
            yield i, j


def mark_visited(wall, y, x):
    for i, j in iterate_scroll(wall, y, x):
        wall[i][j] = VISITED


def check_scroll(wall, y, x):
    scroll_type = wall[y][x]
    h, w = SCROLL_SIZES[scroll_type - 1]

    if y + h > HEIGHT or x + w > WIDTH:
        return False

    for i, j in iterate_scroll(wall, y, x):
        if scroll_type != wall[i][j]:
            return False
    return True



def check_wall(wall):
    scrolls = [0] * len(SCROLL_SIZES)
    for i in range(HEIGHT):
        for j in range(WIDTH):
            scroll_type = wall[i][j]
            if scroll_type is VISITED:
                continue

            if not check_scroll(wall, i, j):
                return
            mark_visited(wall, i, j)
            scrolls[scroll_type - 1] += 1
    return scrolls


def main():
    k = int(input())
    for _ in range(k):
        wall = read_wall()
        result = check_wall(wall)
        if result:
            print('YES')
            print(' '.join(map(str, result)))
        else:
            print('NO')

if __name__ == '__main__':
    main()