const MAX_VALUES = {
  L: 100,
  C: 0.37,
  H: 360,
  a: 1,
};

export function ColorPlayer(initialColor, cb) {
  return (decorated) =&gt; {
    const [L, C, H, _slash, a] = initialColor.split(' ').map(parseFloat);
    const player = {
      color: {L, C, H, a},
      toString() {
        const {L, C, H, a} = this.color;
        return `${L.toFixed(2)}% ${C.toFixed(2)} ${H.toFixed(2)} / ${a.toFixed(2)}`;
      },
      cb,
    };
    
    class Decorated extends decorated {
      __player = player;
    };
    
    cb(player.toString());
    return Decorated;
  };
}

export function Color (component, coeff) {
	return (decorated, context) =&gt; {
      return function (octave) {
        const res = decorated.call(this, octave);
        const {color, cb} = this.__player;
        color[component] = Math.max(0, Math.min(color[component] + (octave - 3) * parseFloat(coeff), MAX_VALUES[component]));
		cb(this.__player.toString());
        return res;
      };
    };
}