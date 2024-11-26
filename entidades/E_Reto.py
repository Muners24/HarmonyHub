import time

import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from entidades.E_Partitura import E_Partitura

class E_Reto():
    
    def __init__(self,idReto=0,idPartitura=0,tiporeto = '',titulo='',fecha=time.localtime()):
        self.IdReto = idReto
        self.IdPartitura = idPartitura
        self.TipoReto = tiporeto
        self.Titulo = titulo
        self.Fecha = fecha
        
    
        