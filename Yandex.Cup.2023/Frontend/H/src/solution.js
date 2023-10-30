const MORSE = {
  a: '.-',
  b: '-...',
  c: '-.-.',
  d: '-..',
  e: '.',
  f: '..-.',
  g: '--.',
  h: '....',
  i: '..',
  j: '.---',
  k: '-.-',
  l: '.-..',
  m: '--',
  n: '-.',
  o: '---',
  p: '.--.',
  q: '--.-',
  r: '.-.',
  s: '...',
  t: '-',
  u: '..-',
  v: '...-',
  w: '.--',
  x: '-..-',
  y: '-.--',
  z: '--..',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  0: '-----',
};

async function doUntilSuccess(task) {
  while(true) {
    try {
      return await task();
    } catch {}
  }
}

async function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function turnOn(t) {
  await new Promise((resolve, reject) => {
    t.taskRunner(() =>
      Promise.all([
        t.moveForward(),
        t.moveDown(),
      ])
        .then(resolve)
        .catch(reject)
    );
  });
}

async function turnOff(t) {
  await new Promise((resolve, reject) => {
    t.taskRunner(() =>
      Promise.all([
        t.moveBack(),
        t.moveUp(),
      ])
        .then(resolve)
        .catch(reject)
    );
  });
}

async function sendSignal(t, timeout) {
  await turnOn(t);
  await wait(timeout);
  await turnOff(t);
}

async function sendChar(t, char, {shortSignalPause, longSignalPause}) {
  const signals = MORSE[char];
  for (signal of signals) {
    switch (signal) {
      case '.':
        await sendSignal(t, shortSignalPause);
        break;
      case '-':
        await sendSignal(t, longSignalPause);
        break;
    }
  }
}

async function sendWord(t, word, {
  shortSignalPause,
  longSignalPause,
  charPause,
  wordPause,
}) {
  await t.grabItem();

  await sendChar(t, word[0], {shortSignalPause, longSignalPause});
  for (const char of word.slice(1)) {
    await wait(charPause);
    await sendChar(t, char, {shortSignalPause, longSignalPause});
  }

  await t.dropItem();
  await wait(wordPause);
}

async function handleMessage(message, transmitters, transmittersQueue, options) {
  // get first ready transmitter
  const t = await Promise.race(transmitters.map(t => transmittersQueue.get(t).then(() => t)));
  const promise = transmittersQueue.get(t);
  // schedule new task
  transmittersQueue.set(t, promise.then(async () => {
    await doUntilSuccess(() => t.init());
    for (const word of message.split(' ')) {
      await doUntilSuccess(() => sendWord(t, word, options));
    }
    await doUntilSuccess(() => t.reset());
  }));
}

module.exports = async function result(
  socket,
  transmitters = [],
  {
    shortSignalPause = 500,
    longSignalPause = 1000,
    charPause = 200,
    wordPause = 2000,
  } = {},
) {
  const options = {
    shortSignalPause,
    longSignalPause,
    charPause,
    wordPause,
  };
  const transmittersQueue = new Map(transmitters.map(t => [t, Promise.resolve()]));
  let messageQueue = Promise.resolve();

  socket.addEventListener('message', (message) => {
    messageQueue = messageQueue.then(() => handleMessage(
      message.data.toLowerCase(),
      transmitters,
      transmittersQueue,
      options,
    ));
  });
};
