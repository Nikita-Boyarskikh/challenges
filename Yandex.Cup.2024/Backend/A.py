patients = {}
t = 0

while True:
	data = input().split(' ')
	command = data[0]
	if command == '!':
		break
	elif command == '?':
		print(round(t / 10 / len(patients), 9), flush=True)
	elif command == '~':
		pid, new_t = data[1], int(float(data[2]) * 10)
		t -= patients[pid]
		t += new_t
		patients[pid] = new_t
	elif command == '-':
		pid = data[1]
		t -= patients[pid]
		del patients[pid]
	else: # +
		pid, new_t = data[1], int(float(data[2]) * 10)
		t += new_t
		patients[pid] = new_t
