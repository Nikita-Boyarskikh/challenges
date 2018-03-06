import sys
import math
from heapq import heappop, heappush, heapify


class Coords:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance(self, coord):
        return int(math.fabs(self.x - coord.x) + math.fabs(self.y - coord.y))


class Car(Coords):
    def __init__(self, x, y, cid):
        super().__init__(x, y)
        self.cid = cid
        self.rides = []

    def __repr__(self):
        return "Car {}".format(self.cid)


class Order:
    def __init__(self, a, b, x, y, s, f, B, oid, dup=None):
        self.coords0 = Coords(a, b)
        self.coords1 = Coords(x, y)
        self.earliest_start = s
        self.distance = self.coords0.distance(self.coords1)
        self.latest_start = f - self.distance
        self.cost = self.distance if self.earliest_start == self.latest_start else self.distance + B
        self.dup = dup
        self.B = B
        self.deleted = False
        self.oid = oid

    def __lt__(self, other):
        return self.cost > other.cost

    def finish_time(self, start_time):
        return start_time + self.cost

    def __repr__(self):
        return "Order id={} {}".format(self.oid, self.cost)


def get_timeline(file, T, B):
    timeline = [[] for _ in range(T)]
    c = 0
    for line in file.readlines():
        a, b, x, y, s, f = map(int, line.split(' '))
        start = Coords(a, b)
        finish = Coords(x, y)
        dst = start.distance(finish)
        idx = f - dst
        idx2 = s
        o = Order(a, b, x, y, s, f, B, c)
        o_bonus = Order(a, b, x, y, s, s + dst, B, c, o)
        o.dup = o_bonus
        heappush(timeline[idx2], o)
        heappush(timeline[idx], o_bonus)
        c += 1

    return timeline


def clean_timeline(timeline):
    for i in range(len(timeline)):
        if timeline[i].deleted:
            del timeline[i]


def get_car(order, cars, t):
    ord_beginning_coords = order.coords0
    iter_cars = iter(cars)
    best_car = None
    min_distance = None

    for car in iter_cars:
        current_distance = car.distance(ord_beginning_coords)
        if order.latest_start >= (current_distance + t):
            min_distance = current_distance
            best_car = car
            break

    if best_car is None:
        return best_car, None

    for car in iter_cars:
        current_distance = car.distance(ord_beginning_coords)
        if current_distance < min_distance and order.latest_start >= (current_distance + t):
            min_distance = current_distance
            best_car = car

    cars.remove(best_car)
    return best_car, min_distance


def main(file):
    R, C, F, N, B, T = map(int, file.readline().split(' '))
    cars_timeline = [[] for _ in range(T)]
    cars = []
    cars_timeline[0] = [Car(0, 0, i) for i in range(F)]
    timeline = get_timeline(file, T, B)

    t = 0
    while N > 0:
        clean_timeline(timeline[t])
        cars = cars_timeline[t]
        print(cars_timeline)
        print(timeline)
        cars_timeline[t] = []

        while len(cars) > 0:
            t_client = t
            while t_client < T and len(timeline[t_client]) == 0:
                t_client += 1
            if t_client == T:
                break

            order = heappop(timeline[t_client])
            car, dst = get_car(order, cars, t_client)
            if dst is not None:
                finish_time = order.finish_time(t_client + dst)
                car = Car(order.coords1.x, order.coords1.y, car.cid)
                car.rides.append(order.oid)
                cars_timeline[finish_time].append(car)

                if order.dup:
                    order.dup.deleted = True
                    order.dup = None
            else:
                if order.dup:
                    order.dup.dup = None
                order.deleted = True
            N -= 1
        if t == T:
            break
        t += 1

    print_cars(cars_timeline + [cars])


def print_cars(timeline):
    result = {}
    for time in timeline:
        for car in time:
            result[car.cid] = result.get(car.cid, []) + car.rides
    for cid, rides in result.items():
        print(cid, *rides)


if __name__ == '__main__':
    main(sys.stdin)


"""
3 4 2 3 2 10
0 0 1 3 2 9
1 2 1 0 0 9
2 0 2 2 0 9
"""