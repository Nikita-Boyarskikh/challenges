const song = {
    metaData: {
        title: 'Highway to Hell',
        author: 'AC/DC',
        date: '27.07.1979',
    },
    tracks: [
        {
            id: 1,
            name: 'Piano',
            soundType: 'virtual_instrument',
            instrument: 'piano',
            regions: [
                {
                    id: 1,
                    start: 0,
                    end: 3,
                    midiData: [
                        {note: 'F4', velocity: 80, startTime: 0, duration: 1},
                        {note: 'D4', velocity: 80, startTime: 1, duration: 1},
                        {note: 'E4', velocity: 90, startTime: 2, duration: 1},
                    ],
                    effects: [
                        {type: 'reverb', intensity: 15},
                        {type: 'delay', time: 0.5, feedback: 30, mix: 20},
                    ],
                },
            ],
            pan: 5,
            volume: 78,
        },
        {
            id: 2,
            name: 'Guitar',
            soundType: 'virtual_instrument',
            instrument: 'guitar',
            regions: [
                {
                    id: 1,
                    start: 0,
                    end: 5,
                    midiData: [
                        {note: 'C4', velocity: 10, startTime: 0, duration: 1},
                        {note: 'E4', velocity: 20, startTime: 1, duration: 1},
                        {note: 'E4', velocity: 30, startTime: 2, duration: 1},
                        {note: 'F4', velocity: 40, startTime: 3, duration: 1},
                        {note: 'D4', velocity: 50, startTime: 4, duration: 1},
                    ],
                },
            ],
            pan: 10,
            volume: 60,
        },
    ],
} as const;

type Get<T extends unknown, Path extends string> = T extends object ? Path extends `${infer X}->${Path}` | '' ? X : never : never;

type songAuthor = Get<typeof song, 'metaData->author'>; // AC/DC
type firstTrackVolume = Get<typeof song, 'tracks->0->volume'>; // 78
type tracksVolume = Get<typeof song, 'tracks->(0-2)->volume'>; // 78 | 60
type notes = Get<typeof song, 'tracks->1->regions->0->midiData->(0-5)->note'>; // "F4" | "D4" | "E4" | "C4"
type midiData = Get<typeof song, 'tracks->1->regions->0->midiData->(0-2)'>; // { note: "C4", velocity: 10, startTime: 0, duration: 1, } | { note: "E4", velocity: 20, startTime: 1, duration: 1 }
type thirdNoteVelocity = Get<typeof song, 'tracks->1->regions->0->midiData->3->velocity'>; // 40


type AAA = `a${AAA}` | '';

const a: AAA = 'aa'
