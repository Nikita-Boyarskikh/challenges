// helpers

const lightSwitch = function () {
    Object.getOwnPropertyNames(this).forEach(name => {
        if (name.startsWith('$')) {
            return;
        }

        const descriptor = Object.getOwnPropertyDescriptor(this, name);
        Object.defineProperty(name, {
            ...descriptor,
            enumerable: !descriptor.enumerable,
        });
    });
};
const getter = function (key) { /* Your code here */ };

module.exports = { lightSwitch, getter }

// example

const artObject = {
    $redRose: 11101,
    metroStations: ['Park Kultury', 'Delovoy Center'],
    busStops: ['B', 'c910', '379'],
    $city: 10101,
    towers: ['Oko', 'Neva'],
    $getTransports() {
        const stations = this.$getter('metroStations')
        const stops = this.$getter('busStops')
        return [...stations, ...stops]
    },
    $lightSwitch: lightSwitch,
    $getter: getter,
}

artObject.$lightSwitch()

// basic tests

console.log('towers' in artObject) //-> false
console.log(artObject.$getter('towers')) //-> [ 'Oko', 'Neva' ]
console.log(artObject.$redRose) //-> 11101
console.log(artObject.$getTransports()) //-> [ 'Park Kultury', 'Delovoy Center', 'B', 'c910', '379' ]
