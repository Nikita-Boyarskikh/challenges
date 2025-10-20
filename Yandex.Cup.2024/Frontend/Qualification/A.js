class Traffic {
  constructor(initialSignal, trafficLightController) {
    this.currentSignal = initialSignal;
    this.awaits = {
      FORWARD: [],
      LEFT: [],
      RIGHT: [],
    };

    trafficLightController.subscribe((currentSignal) => {
      // Регулировщик сменил сигнал
      this.currentSignal = currentSignal;
      this.awaits[this.getAllowedDirection(currentSignal)]?.forEach(resolve => resolve());
    });
  }

  getAllowedDirection(signal) {
    switch (signal) {
      case 'GREEN':
        return 'FORWARD';
      case 'LEFT':
        return 'LEFT';
      case 'RIGHT':
        return 'RIGHT';
    }
  }

  async go(direction) {
    // Вернуть промис, который зарезолвится, когда можно будет проехать в переданном направлении.
    if (this.getAllowedDirection(this.currentSignal) === direction) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.awaits[direction].push(resolve);
    });
  }
}

exports.Traffic = Traffic;
