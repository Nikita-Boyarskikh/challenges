def read_int_row():
    return list(map(int, input().split(' ')))


def main():
    n, k = read_int_row()
    a = sorted(read_int_row())

    prefix_sum = [0] * (n + 1)
    for i, x in enumerate(a):
        prefix_sum[i + 1] = prefix_sum[i] + x

    result = a[0]
    min_sum_dist = float('inf')

    for left in range(n - k + 1):
        right = left + k - 1
        mid = left + (k - 1) // 2  # медианный индекс
        x = a[mid]

        # сумма расстояний от x до a[left..right]
        # слева от медианы (включая её)
        left_count = mid - left + 1
        left_sum = x * left_count - (prefix_sum[mid + 1] - prefix_sum[left])
        # справа от медианы
        right_count = right - mid
        right_sum = (prefix_sum[right + 1] - prefix_sum[mid + 1]) - x * right_count

        total_dist = left_sum + right_sum

        if total_dist < min_sum_dist:
            min_sum_dist = total_dist
            result = x

    print(result)


if __name__ == '__main__':
    main()
