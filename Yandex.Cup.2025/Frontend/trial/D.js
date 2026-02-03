const Signal = {
  GREEN: 'GREEN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  RED: 'RED',
};

const Direction = {
  FORWARD: 'FORWARD',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const SignalToDirectionMap = {
  [Signal.GREEN]: Direction.FORWARD,
  [Signal.LEFT]: Direction.LEFT,
  [Signal.RIGHT]: Direction.RIGHT,
  [Signal.RED]: null,
};

class Traffic {
  constructor(initialSignal, trafficLightController) {
    this.currentSignal = initialSignal;
    this.resolves = Object.fromEntries(
      Object.keys(Direction).map((direction) => [direction, []]),
    );

    trafficLightController.subscribe((currentSignal) => {
      // Регулировщик сменил сигнал
      this.currentSignal = currentSignal;
      const resolves = this.resolves[SignalToDirectionMap[currentSignal]];
      if (resolves) {
        resolves.forEach(resolve => resolve());
        resolves.length = 0;
      }
    });
  }

  canGo(direction) {
    return SignalToDirectionMap[this.currentSignal] === direction;
  }

  async go(direction) {
    // Вернуть промис, который зарезолвится, когда можно будет проехать в переданном направлении.
    if (this.canGo(direction)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.resolves[direction].push(resolve);
    });
  }
}

/// =====

class Controller {
  subscriptions = [];
  change(signal) {
    this.subscriptions.forEach(cb => cb(signal));
  }
  subscribe(cb) {
    this.subscriptions.push(cb);
  }
}

const controller = new Controller();
const traffic = new Traffic(Signal.GREEN, controller)

const go = (dir) => traffic.go(dir).then(() => console.log(`go ${dir}!`));
