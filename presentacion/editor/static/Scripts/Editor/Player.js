class Player {

    constructor() {
        this.sampler = null;
        this.noteMap = null;
        this.durationMap = null;
        this.init();
    }

    init() {

        this.sampler = new Tone.Sampler({
            urls: {
                C0: "C0.mp3",
                D0: "D0.mp3",
                E0: "E0.mp3",
                F0: "F0.mp3",
                G0: "G0.mp3",
                A0: "A0.mp3",
                B0: "B0.mp3",
                C1: "C1.mp3",
                D1: "D1.mp3",
                E1: "E1.mp3",
                F1: "F1.mp3",
                G1: "G1.mp3",
                A1: "A1.mp3",
                B1: "B1.mp3",
                C2: "C2.mp3",
                D2: "D2.mp3",
                E2: "E2.mp3",
                F2: "F2.mp3",
                G2: "G2.mp3",
                A2: "A2.mp3",
                B2: "B2.mp3",
                C3: "C3.mp3",
                D3: "D3.mp3",
                E3: "E3.mp3",
                F3: "F3.mp3",
                G3: "G3.mp3",
                A3: "A3.mp3",
                B3: "B3.mp3",
                C4: "C4.mp3",
                D4: "D4.mp3",
                E4: "E4.mp3",
                F4: "F4.mp3",
                G4: "G4.mp3",
                A4: "A4.mp3",
                B4: "B4.mp3",
                C5: "C5.mp3",
                D5: "D5.mp3",
                E5: "E5.mp3",
                F5: "F5.mp3",
                G5: "G5.mp3",
                A5: "A5.mp3",
                B5: "B5.mp3",
                C6: "C6.mp3",
                D6: "D6.mp3",
                E6: "E6.mp3",
                F6: "F6.mp3",
                G6: "G6.mp3",
                A6: "A6.mp3",
                B6: "B6.mp3",
                C7: "C7.mp3",
                D7: "D7.mp3",
                E7: "E7.mp3",
                F7: "F7.mp3",
                G7: "G7.mp3",
                A7: "A7.mp3",
                B7: "B7.mp3",

            },
            release: 0.5,
            baseUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/",
        }).toDestination();

        this.noteMap = {
            "c/0": "C0", "d/0": "D0", "e/0": "E0", "f/0": "F0", "g/0": "G0", "a/0": "A0", "b/0": "B0",
            "c/1": "C1", "d/1": "D1", "e/1": "E1", "f/1": "F1", "g/1": "G1", "a/1": "A1", "b/1": "B1",
            "c/2": "C2", "d/2": "D2", "e/2": "E2", "f/2": "F2", "g/2": "G2", "a/2": "A2", "b/2": "B2",
            "c/3": "C3", "d/3": "D3", "e/3": "E3", "f/3": "F3", "g/3": "G3", "a/3": "A3", "b/3": "B3",
            "c/4": "C4", "d/4": "D4", "e/4": "E4", "f/4": "F4", "g/4": "G4", "a/4": "A4", "b/4": "B4",
            "c/5": "C5", "d/5": "D5", "e/5": "E5", "f/5": "F5", "g/5": "G5", "a/5": "A5", "b/5": "B5",
            "c/6": "C6", "d/6": "D6", "e/6": "E6", "f/6": "F6", "g/6": "G6", "a/6": "A6", "b/6": "B6",
            "c/7": "C7", "d/7": "D7", "e/7": "E7", "f/7": "F7", "g/7": "G7", "a/7": "A7", "b/7": "B7"
        };

        this.durationMap = {
            "1": "1n",     // 1 nota completa (una redonda)
            "2": "2n",     // 2 tiempos (una blanca)
            "4": "4n",     // 4 tiempos (una negra)
            "8": "8n",     // 8 tiempos (una corchea)
            "16": "16n",   // 16 tiempos (una semicorchea)
            "32": "32n",   // 32 tiempos (una fusa)
            "64": "64n",   // 64 tiempos (una semifusa)
        };
    }

    async play(notacion) {
        Tone.Transport.bpm.value = notacion.tempo;
        const now = Tone.now();

        let notas = notacion.notas;
        let time = now;

        for (let i = 0; i < notas.length; i++) {
            if (notas[i].dur.includes('r')) {
                let dur = this.durationMap[notas[i].dur.replace('r', '')];
                time += Tone.Time(dur).toSeconds();
                Tone.Transport.schedule(time => { }, time);
                continue;
            }

            let dur = this.durationMap[notas[i].dur];
            let toneKeys = [];
            for (let j = 0; j < notas[i].keys.length; j++) {
                toneKeys.push(this.noteMap[notas[i].keys[j]]);
            }

            this.sampler.triggerAttackRelease(toneKeys, dur,time);
            time += Tone.Time(dur).toSeconds();

        }
    }
}

