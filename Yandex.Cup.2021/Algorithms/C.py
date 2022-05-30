from string import ascii_uppercase


def complete(string, used_letters):
  letters = set(ascii_uppercase) - used_letters
  return string + ''.join(letters)


def is_one_letter_string(string):
  return all(x == string[0] for x in string)


def get_DNA_mapping(string):
  result = ''
  used_letters = set()
  string_part = string
  for i in range(len(ascii_uppercase)):
    a, b = string_part[::2], string_part[1::2]
    if not is_one_letter_string(a):
      a, b = b, a

    if not is_one_letter_string(a) or a[0] in used_letters:
      raise Exception('No answer found')

    result += a[0]
    used_letters.add(a[0])
    string_part = b

    if len(string_part) == 0:
      return complete(result, used_letters), 2 ** i - string.index(a[0]) - 1


if __name__ == '__main__':
  string = input()
  try:
    mapping, position = get_DNA_mapping(string)
    print(mapping)
    print(position + 1)
  except Exception:
    print('No solution')
