import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from datos.D_Nivel import D_Nivel

class N_Nivel:

    def __init__(self):
        self.DN = D_Nivel()
    
    
    def getNivelPorId(self,id):
        return self.DN.buscarNivelPorId(id)

