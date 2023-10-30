/**
 * @param {number} max
 * @returns {number} - случайное целое число в диапазоне [0; max)
 */
function random(max) {
    return Math.trunc(Math.random() * max);
}

/**
 * Рисование случайных прямоугольников
 *
 * @param {number} N количество прямоугольников
 * @param {number} xMax максимальная координата x
 * @param {number} yMax максимальная координата y
 * @returns {Array}
 */
function draw(N, xMax, yMax) {
    const result = [];
    for (let i = 0; i < N; i++) {
        const [x1, y1] = [random(xMax), random(yMax)];
        const [x2, y2] = [random(xMax), random(yMax)];
        result.push([[x1, y1], [x1, y2], [x2, y2], [x2, y1]]);
    }
    return result;
}

module.exports = { draw };
