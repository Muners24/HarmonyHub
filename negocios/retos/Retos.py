import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from entidades.E_Reto import E_Reto
from entidades.E_Partitura import E_Partitura
from datos.D_Reto import D_Reto
from datos.D_Participacion import D_Participacion

class Retos:

    def __init__(self):
        self.DR = D_Reto()
        self.DP = D_Participacion()

    def genRetoArmonico(self):
        return {
            "tempo": 120.0,
            "numerator": 4,
            "denominator": 4,
            "notas": [
                {"keys": ["c/4"], "dur": "4"},
                {"keys": ["a/4"], "dur": "4"},
                {"keys": ["c/4"], "dur": "4"},
                {"keys": ["a/4"], "dur": "4"},
            ],
        }

    def genRetoRitmico(self):
        return {
            "tempo": 120.0,
            "numerator": 4,
            "denominator": 4,
            "notas": [
                {"keys": ["c/4"], "dur": "4"},
                {"keys": ["a/4"], "dur": "4"},
                {"keys": ["c/4"], "dur": "4"},
                {"keys": ["a/4"], "dur": "4"},
            ],
        }

    def genRetoMelodico(self):
        return {
            "tempo": 120.0,
            "numerator": 4,
            "denominator": 4,
            "notas": [
                {"keys": ["c/4"], "dur": "4"},
                {"keys": ["a/4"], "dur": "4"},
                {"keys": ["c/4"], "dur": "4"},
                {"keys": ["a/4"], "dur": "4"},
            ],
        }
        
    def getRetos(self):
        return self.DR.listarRetosSemanales()

    def participar(self,participacion):
        return self.DP.insertarParticipacion(participacion)
