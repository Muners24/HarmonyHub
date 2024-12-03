var sampler;

document.addEventListener("DOMContentLoaded", () => {
    sampler = new Tone.Sampler({
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
})


async function playMidi() {
    
    
    Tone.loaded().then(() => {
        sampler.triggerAttackRelease(["C4"], 1);
    });
} 