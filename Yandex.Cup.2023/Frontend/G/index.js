const container = document.getElementById('app');
const CELL_SIZE = 40;
const GAME_SPEED = 10;
const DEBUG_MODE = true;

function adjustContainer(container, n) {
    container.style.minWidth = `${CELL_SIZE*n}px`;
    container.style.minHeight = `${CELL_SIZE*n}px`;
}

function makeFieldElem(container, x, y, text) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.className = 'cell';

    div.textContent = text;

    container.appendChild(div);

    return div;
}

function playGame(container, data, solution) {
    window.__FINISHED = false;
    const n = data.size;
    adjustContainer(container, n);

    let i = 0;
    const l = data.moves.length;
    let finished = false;
    let prevNode;

    const nextMove = () => {
        setTimeout(() => {
            if (finished) return;
            const {x, y, char} = data.moves[i];
            const tNode = makeFieldElem(container, x, y, char === 'X' ? 'H' : 'S');
            if (!DEBUG_MODE && prevNode) {
                prevNode.remove();
            }
            prevNode = tNode;
            i++;
            if (i < l) nextMove();
            else if (typeof solution !== 'function') {
                window.__FINISHED = true;
            }
        }, data.moves[i].timeout*GAME_SPEED);
    };

    if (typeof solution === 'function') {
        solution(container, n, (moveNum, winner) => {
            const winnerInfo = winner === 'P' ? 'no winner' : 'winner=' + winner;
            const resultStr = `moveNum=${moveNum}, ${winnerInfo}`;
            if (window.processResult) {
                window.processResult(resultStr);
            }
            console.log(`Result: moveNum=${moveNum}, ${winnerInfo}`);
            finished = true;
            window.__FINISHED = true;
        });
    }

    if (l > 0) {
        nextMove();
    }
    else {
        window.__FINISHED = true;
    }
}


playGame(container, window.__DATA, solution);
