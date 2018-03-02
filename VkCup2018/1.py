import sys

pas = list(input().lower())

equals = {
    'o': ('0',),
    '0': ('o',),
    'l': ('1', 'i',),
    '1': ('l', 'i',),
    'i': ('l', '1',),
}


def check_pass():
    for str in sys.stdin:
        str = str.rstrip().lower()
        if len(pas) == len(str):
            eql = True
            for i in range(len(pas)):
                if not(pas[i] == str[i] or pas[i] in equals.get(str[i], [])):
                    eql = False
                    break
            if eql:
                return False

    return True


print('Yes' if check_pass() else 'No')
