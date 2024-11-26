import json
from mido import MidiFile, MidiTrack, Message, MetaMessage
from django.http import FileResponse, JsonResponse
from io import BytesIO
import os
import tempfile

k = {
    # Notas naturales
    "c/1": 24, "d/1": 26, "e/1": 28, "f/1": 29, "g/1": 31, "a/1": 33, "b/1": 35,
    "c/2": 36, "d/2": 38, "e/2": 40, "f/2": 41, "g/2": 43, "a/2": 45, "b/2": 47,
    "c/3": 48, "d/3": 50, "e/3": 52, "f/3": 53, "g/3": 55, "a/3": 57, "b/3": 59,
    "c/4": 60, "d/4": 62, "e/4": 64, "f/4": 65, "g/4": 67, "a/4": 69, "b/4": 71,
    "c/5": 72, "d/5": 74, "e/5": 76, "f/5": 77, "g/5": 79, "a/5": 81, "b/5": 83,
    "c/6": 84, "d/6": 86, "e/6": 88, "f/6": 89, "g/6": 91, "a/6": 93, "b/6": 95,
    "c/7": 96, "d/7": 98, "e/7": 100, "f/7": 101, "g/7": 103, "a/7": 105, "b/7": 107,
    "c/8": 108, "d/8": 110, "e/8": 112, "f/8": 113, "g/8": 115, "a/8": 117, "b/8": 119,
    "c/9": 120, "d/9": 122, "e/9": 124, "f/9": 125, "g/9": 127, "a/9": 129, "b/9": 131,
    
    # Sostenidos
    "c#/1": 25, "d#/1": 27, "f#/1": 30, "g#/1": 32, "a#/1": 34, "b#/1": 36,
    "c#/2": 37, "d#/2": 39, "f#/2": 42, "g#/2": 44, "a#/2": 46, "b#/2": 48,
    "c#/3": 49, "d#/3": 51, "f#/3": 54, "g#/3": 56, "a#/3": 58, "b#/3": 60,
    "c#/4": 61, "d#/4": 63, "f#/4": 66, "g#/4": 68, "a#/4": 70, "b#/4": 72,
    "c#/5": 73, "d#/5": 75, "f#/5": 78, "g#/5": 80, "a#/5": 82, "b#/5": 84,
    "c#/6": 85, "d#/6": 87, "f#/6": 90, "g#/6": 92, "a#/6": 94, "b#/6": 96,
    "c#/7": 97, "d#/7": 99, "f#/7": 102, "g#/7": 104, "a#/7": 106, "b#/7": 108,
    "c#/8": 109, "d#/8": 111, "f#/8": 114, "g#/8": 116, "a#/8": 118, "b#/8": 120,
    "c#/9": 121, "d#/9": 123, "f#/9": 126, "g#/9": 128, "a#/9": 130, "b#/9": 132,

    # Bemoles
    "db/1": 25, "eb/1": 27, "gb/1": 30, "ab/1": 32, "bb/1": 34, "cb/1": 36,
    "db/2": 37, "eb/2": 39, "gb/2": 42, "ab/2": 44, "bb/2": 46, "cb/2": 48,
    "db/3": 49, "eb/3": 51, "gb/3": 54, "ab/3": 56, "bb/3": 58, "cb/3": 60,
    "db/4": 61, "eb/4": 63, "gb/4": 66, "ab/4": 68, "bb/4": 70, "cb/4": 72,
    "db/5": 73, "eb/5": 75, "gb/5": 78, "ab/5": 80, "bb/5": 82, "cb/5": 84,
    "db/6": 85, "eb/6": 87, "gb/6": 90, "ab/6": 92, "bb/6": 94, "cb/6": 96,
    "db/7": 97, "eb/7": 99, "gb/7": 102, "ab/7": 104, "bb/7": 106, "cb/7": 108,
    "db/8": 109, "eb/8": 111, "gb/8": 114, "ab/8": 116, "bb/8": 118, "cb/8": 120,
    "db/9": 121, "eb/9": 123, "gb/9": 126, "ab/9": 128, "bb/9": 130, "cb/9": 132
}

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

def vexNotesToMidoNotes(data):
    note_mappings = k
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
        track.append(
            MetaMessage(
                "time_signature",
                numerator=data["numerator"],
                denominator=data["denominator"],
                clocks_per_click=24,
                notated_32nd_notes_per_beat=8,
                time=0,
            )
        )
        for note in midi_notes:
            if not note.isRest():
                for key in note.getKeys():
                    track.append(Message("note_on", note=key, velocity=64, time=0))

                for key in note.getKeys():
                    track.append(
                        Message(
                            "note_off",
                            note=key,
                            velocity=0,
                            time=int(480 * (denCompas / note.getDuration())),
                        )
                    )
            else:
                silence_duration = int(480 * (denCompas / note.getDuration()))
                track.append(
                    Message(
                        "note_on",  
                        note=0, 
                        velocity=0,
                        time=silence_duration,
                    )
                )
    
        with tempfile.NamedTemporaryFile(suffix=".mid", delete=False) as temp_file:
            midi_path = temp_file.name 
            mid.save(midi_path)

        return midi_path
    
    except Exception as e:
        print("Error al generar el archivo MIDI:", e)
        return None
