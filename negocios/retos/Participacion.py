import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from datos.D_Participacion import D_Participacion
from entidades.E_Participacion import E_Participacion

class Retos:

    def __init__(self):
        self.DP = D_Participacion()

    def participar(self,participacion: E_Participacion):
        return self.DP.insertarParticipacion(participacion)
