const CIPHERS = {
    'r7': '0a54fac6',
    'b': '0d310047',
    'r': '2675264e',
    'r13': '5f2f9518',
    'r17': '9bf8d91b',
};
const ALGORITHM = ['r17', 'b', 'r13', 'r', 'b', 'r7'];

async function initializeCiphers() {
    return Object.fromEntries(
        await Promise.all(
            Object.entries(CIPHERS).map(async ([name, path]) => {
                const module = await import(`https://205864b7dcb3e61b.ctf-2026.ilovefrontend.ru/ciphers/${path}.js`);
                await module.default();
                return [name, module];
            }),
        ),
    );
}

let ciphersPromise = initializeCiphers();
async function decode(algorithm, text) {
    const ciphers = await ciphersPromise;
    return ciphers[algorithm].decode(text);
}

async function encode(algorithm, text) {
    const ciphers = await ciphersPromise;
    return ciphers[algorithm].encode(text);
}

async function main() {
    let data = 'GK1Vt2EEJbWcFKWrEbWIHOEAMOSzFOglt2jpsaAaMX9cFMEoEeMLKOD1MX5kDKAp';
    for (let i = 0; i < ALGORITHM.length; i++) {
        data = await decode(ALGORITHM[i], data);
        console.log(data);
    }
}

main()