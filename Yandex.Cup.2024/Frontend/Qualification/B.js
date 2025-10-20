const isProxy = Symbol('isProxy');

const wrapInner = (arg, path) => {
  return new Proxy(arg, {
    get(target, prop, receiver) {
      path.push(prop);
      const result = Reflect.get(target, prop, receiver);

      if (typeof result === 'object') {
        return wrapInner(result, path);
      }
      return result;
    },
  });
};

const wrap = (arg, path, steps) => {
  let proxyEnabled = true;

  return {
    proxy: new Proxy(arg, {
      get(target, prop, receiver) {
        if (prop === isProxy) {
          return true;
        }

        const result = Reflect.get(target, prop, receiver);

        if (!proxyEnabled) {
          return result;
        }

        const step = [path, prop];
        steps.push(step);

        if (typeof result === 'object') {
          return wrapInner(result, step);
        }
        return result;
      },
    }),
    revoke: () => {proxyEnabled = false},
  };
};

// ignore loops
const traverse = (obj, cond) => {
  if (cond(obj)) {
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach(value => traverse(value, cond));
  } else if (typeof obj === 'object' && obj) {
    Object.values(obj).forEach(value => traverse(value, cond));
  }
}

const createSelector = (selector) => {
  return (...args) => {
    const steps = [];
    const wrappedArgs = args.map((arg, i) => wrap(arg, `arg${i}`, steps));
    const proxies = wrappedArgs.map(({proxy}) => proxy);
    const revokes = wrappedArgs.map(({revoke}) => revoke);
    const result = selector(...proxies);
    revokes.forEach(revoke => revoke());

    // check returns
    proxies.forEach((arg, i) => {
      traverse(result, (value) => {
        if (value === arg) {
          steps.push([`arg${i}`]);
          return true;
        }
        return !!value?.[isProxy];
      });
    });

    return {result, steps};
  };
};

// =======================

const selector1 = createSelector((state) => {
  if (state.isEnabled) {
    return state.inner.value;
  }

  return null;
});

const selector2 = createSelector((state) => {
  if (Array.isArray(state.array) && state.array.length > 0) {
    return state.array[0];
  }

  return null;
});

const selector3 = createSelector((state, params) => {
  if (params.short) {
    return {
      id: state.id,
      name: state.name,
    };
  }

  return state;
});

const result1 = selector1({ isEnabled: true, inner: { value: 42 } })
const result2 = selector1({ isEnabled: false, inner: { value: 21 } })
const result3 = selector2({ array: [1, 2, 3] });
const result4 = selector3({ id: 2135, name: "Ivan", lastname: "Ivanov", age: 25 }, { short: false });

const obj1 = {
  result: 42,
  steps: [
    ["arg0", "isEnabled"],
    ["arg0", "inner", "value"],
  ],
}

const obj2 = {
  result: null,
  steps: [["arg0", "isEnabled"]],
}

const obj3 = {
  result: 1,
  steps: [
    ["arg0", "array"],
    ["arg0", "array", "length"],
    ["arg0", "array", "0"]
  ],
}

const obj4 = {
  result: {
    id: 2135,
    name: "Ivan",
    lastname: "Ivanov",
    age: 25
  },
  steps: [
    ["arg1","short"],
    ["arg0"]
  ]
}

console.log(JSON.stringify(result1) === JSON.stringify(obj1)) // true
console.log(JSON.stringify(result2) === JSON.stringify(obj2)) // true
console.log(JSON.stringify(result3) === JSON.stringify(obj3)) // true
console.log(JSON.stringify(result4) === JSON.stringify(obj4)) // true
