function splitRight(value, sep) {
  const parts = value.split(sep);
  const right = parts.pop();
  const left = parts.join(sep);
  return [left, right];
}

const uniqArrayItemGenerator = (array, path) => {
  const uniq = new Map();
  let i = 0;

  function evalPathPart(value, path) {
    if (!path) {
      return value;
    }

    if (path.endsWith(']')) {
      const [source, index] = splitRight(path, '[');
      return evalPathPart(value, source)?.[+index.slice(0, -1)];
    }

    if (path.endsWith(')')) {
      const result = evalPathPart(value, path.slice(0, -2));
      if (typeof result === 'function') {
        return result();
      } else {
        return undefined;
      }
    }
    return value?.[path];
  }

  function getByPath(value) {
    if (!path) {
      return value;
    }

    const parts = path.split('.');
    let result = value;
    parts.forEach(part => {
      result = evalPathPart(result, part);
    });
    return result;
  }

  return {
    next() {
      while (uniq.has(getByPath(array[i])) && i < array.length) {
        i++;
      }

      const done = i === array.length;
      if (!done) {
        uniq.set(getByPath(array[i]), i);
      }

      return {
        value: done ? Array.from(uniq.values()) : i,
        done,
      };
    },
  };
}

module.exports = uniqArrayItemGenerator;
