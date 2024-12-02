import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from datos.D_Partitura import D_Partitura

class N_Partitura:

    def __init__(self):
        self.DP = D_Partitura()

    def insertarPartitura(self,partitura):
        return self.DP.insertarPartitura(partitura)
        
    def getPartituraRetoPorTipo(self,tipo):
        return self.DP.buscarPartituraPorTipoReto(tipo)

    def getPartituraPorIdReto(self,id):
        return self.DP.buscarPartituraPorIdReto(id)
    
    def getPartituraPorId(self,idPartitura):
        return self.DP.buscarPartituraPorId(idPartitura)
