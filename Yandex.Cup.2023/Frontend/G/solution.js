const WIN_LEN = 5;

function createMatcher(container, size) {
  const fieldStyles = getComputedStyle(container);
  const fieldPadding = parseFloat(fieldStyles.padding);
  const fieldWidth = container.clientWidth - 2 * fieldPadding;
  const fieldHeight = container.clientHeight - 2 * fieldPadding;
  const cellWidth = fieldWidth / size;
  const cellHeight = fieldHeight / size;

  return (node) => {
    const x = Math.round((node.offsetLeft - fieldPadding) / cellWidth);
    const y = Math.round((node.offsetTop - fieldPadding) / cellHeight);
    return {x, y};
  };
}

function check(isOk, rowSize) {
  let counter = 0;
  for (let i = 0; i < rowSize; i++) {
    if (isOk(i)) {
      counter++;
    } else {
      counter = 0;
    }

    if (counter >= WIN_LEN) {
      return true;
    }

    const remains = WIN_LEN - counter;
    if (remains + i >= rowSize) {
      return false;
    }
  }

  return false;
}

function checkRow(board, x, y) {
  const width = board[y].length;
  const isOk = (i) => board[y][i] === board[y][x];
  return check(isOk, width);
}

function checkCol(board, x, y) {
  const height = board.length;
  const isOk = (i) => board[i][x] === board[y][x];
  return check(isOk, height);
}

function checkMainDiag(board, x, y) {
  const k = y - x;
  const height = board.length;
  const width = board[y].length;
  const diagSize = Math.max(width, height) - Math.abs(k);
  const isOk = (i) => {
    console.log('DIAG', x, y, i + Math.max(0, -k), i + Math.max(0, k));
    return board[i + Math.max(0, k)][i + Math.max(0, -k)] === board[y][x];
  };
  return check(isOk, diagSize);
}

function checkAntiDiag(board, x, y) {
  const k = x - y;
  const height = board.length;
  const width = board[y].length;
  const diagSize = Math.abs(width - x) + Math.abs(height - y);
  const isOk = (i) => {
    console.log('ANTI', x, y, i + Math.max(0, -k), i + Math.max(0, k), diagSize);
    return board[i + Math.max(0, k)][i + Math.max(0, -k)] === board[y][x];
  };
  return check(isOk, diagSize);
}

function onTurn(board, text, {x, y}, onEndGame) {
  board.turns++;
  board[y][x] = text;

  const k = x - y;
  if (
    checkRow(board, x, y) ||
    checkCol(board, x, y) ||
    checkMainDiag(board, x, y) ||
    checkAntiDiag(board, x, y)
  ) {
    onEndGame(board.turns, text);
    return true;
  }

  if (board.turns === board.length * board[0].length - 1) {

    onEndGame(board.turns, 'P');
    return true;
  }
}

function solution(container, size, onEndGame) {
  const getCellIdx = createMatcher(container, size);
  const board = Array.from(new Array(size), () => [...new Array(size).fill(null)]);
  board.turns = 0;

  const observer = new MutationObserver((mutations, observer) => {
    const end = mutations.filter(({type}) => type === 'childList').find(mutation => {
      return Array.from(mutation.addedNodes).find(node => {
        return onTurn(board, node.innerText, getCellIdx(node), onEndGame);
      });
    });

    if (end) {
      observer.disconnect();
    }
  });

  observer.observe(container, {childList: true});
}
