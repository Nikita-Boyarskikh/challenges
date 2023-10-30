const path = require('path');
const solution = require(path.resolve(process.argv[2] || 'solutions/solution_ml.js'));
const input = require('./input.json');

const rectangles = solution.draw(input.n, input.xMax, input.yMax);
console.log(JSON.stringify(rectangles));

if (rectangles.length !== input.n) process.exit(1);

for (const rectangleCorners of rectangles) {
    if (rectangleCorners.length !== 4) process.exit(2);

    for (const point of rectangleCorners) {
        if (point.length !== 2) process.exit(3);
        if (point[0] < 0 || point[0] >= input.xMax) process.exit(4);
        if (point[1] < 0 || point[1] >= input.yMax) process.exit(5);
    }
}
