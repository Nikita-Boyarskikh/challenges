def backward_range(from_, to):
    return range(to, from_ - 1, -1)


def main():
    source = input()
    yandex = "Yandex"
    cup = "Cup"

    source_len = len(source)
    yandex_len = len(yandex)
    cup_len = len(cup)
    variations_num = source_len - yandex_len - cup_len + 1

    # inline it to prevent source copying
    def get_diff(start, target):
        res = 0
        target_len = len(target)
        for i in range(target_len):
            res += source[i + start] != target[i]
        return res

    # Looking for best position for Cup
    min_diff_cup_from = [float('inf')] * (variations_num + 1)
    best_position_cup_from = [-1] * variations_num
    for source_position in backward_range(yandex_len, source_len - cup_len):
        i = source_position - yandex_len
        diff = get_diff(source_position, cup)
        if diff <= min_diff_cup_from[i + 1]:
            min_diff_cup_from[i] = diff
            best_position_cup_from[i] = source_position
        else:
            min_diff_cup_from[i] = min_diff_cup_from[i + 1]
            best_position_cup_from[i] = best_position_cup_from[i + 1]

    # Looking for best position for Yandex
    min_diff = float('inf')
    best_position_yandex = 0
    best_position_cup = yandex_len
    for i in range(variations_num):
        diff = get_diff(i, yandex) + min_diff_cup_from[i]
        if diff < min_diff:
            min_diff = diff
            best_position_yandex = i
            best_position_cup = best_position_cup_from[i]

    print(
        source[:best_position_yandex]
        + yandex
        + source[best_position_yandex + yandex_len:best_position_cup]
        + cup
        + source[best_position_cup + cup_len:]
    )


if __name__ == '__main__':
    main()