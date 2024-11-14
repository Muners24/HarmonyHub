import json
from mido import MidiFile, MidiTrack, Message, MetaMessage


class midoNote:
    def __init__(self, keys, dur):
        self.keys = keys
        self.duration = dur

    def getKeys(self):
        return self.keys

    def getDuration(self):
        return int(self.duration.replace("r", ""))

    def isRest(self):
        return "r" in self.duration


def load_notes_from_json(json_path):
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
            return data.get("notas", {})
    except Exception as e:
        print(f"Error al cargar el archivo JSON: {e}")
        return {}


def vexNotesToMidoNotes(data):
    note_mappings = load_notes_from_json("negocios\editor\\notas.json")
    notas = data["notas"]
    midoNotes_bit = []

    for nota in notas:
        print(nota)
        midi_notes = [note_mappings.get(key, None) for key in nota["keys"]]
        midoNotes_bit.append(midoNote(midi_notes, nota["dur"]))

    return midoNotes_bit


def exportMidi(data):

    try:
        midi_notes = vexNotesToMidoNotes(data)
        mid = MidiFile()
        track = MidiTrack()
        mid.tracks.append(track)

        denCompas = data["denominator"]
        tempo = int(60000000 / data["tempo"])
        track.append(MetaMessage("set_tempo", tempo=tempo))

        for note in midi_notes:
            if not note.isRest():
                for key in note.getKeys():
                    track.append(Message("note_on", note=key, velocity=64, time=0))

                for key in note.getKeys():
                    track.append(
                        Message(
                            "note_off",
                            note=key,
                            velocity=64,
                            time=int(480*(denCompas / note.getDuration()))
                        )
                    )
            else:
                silence_duration = int(480 * (denCompas / note.getDuration()))
                track.append(Message("note_off", note=0, velocity=0, time=silence_duration))

        path = data['path']
        mid.save(path)

        print(f"Archivo MIDI generado en: {path}")


    except Exception as e:
        print("Error al generar el archivo MIDI:", e)
        return None
