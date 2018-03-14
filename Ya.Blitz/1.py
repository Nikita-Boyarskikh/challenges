n = int(input())

num = input().split()
score = 0
P = 0
V = 0
for i in range(len(num)):
    if i%2 == 0:
        score += 1
        if int(num[i]) > int(num[1+i]):
            P += score
            score = 0
        elif int(num[i]) < int(num[i+1]):
            V += score
            score = 0

if P > V:
    print("Petya")
else:
    print("Vasya")
