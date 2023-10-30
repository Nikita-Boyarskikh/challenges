function drawTree(startY, angle, level = 0) {
    const startX = canvas.width / 2;
    const stack = [[startY, angle, level]];
    const cache = {};

    while (stack.length > 0) {
        const value = stack.pop();
        if (value === 'restoreCtx') {
            ctx.restore();
            continue;
        }

        const [y, angle, level] = value;
        const len = length * Math.pow(depth, level);

        ctx.beginPath();
        ctx.save();

        ctx.translate(level ? 0 : startX, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);

        if (!cache[level]) {
            cache[level] = {
                width: computeWidth(level),
                color: computeColor(level),
            };
        }
        const { width, color } = cache[level];
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        ctx.stroke();

        if (len < 10) {
            ctx.restore();
            continue;
        }

        const newLevel = level + 1;
        stack.push('restoreCtx');
        stack.push([-len, angle + angleOffset, newLevel]);
        stack.push([-len, angle - angleOffset, newLevel]);
    }
};
