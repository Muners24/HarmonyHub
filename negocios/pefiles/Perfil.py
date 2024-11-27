import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))

import bcrypt

from datos.D_Perfil import D_Perfil
from entidades.E_Perfil import E_Perfil

class Perfil:
    
    def __init__(self):
        self.DP = D_Perfil()
    
    def buscarPerfilPorIdUsuario(self,id) -> E_Perfil:
        return self.DP.buscarPefilPorIdUsuario(id)
    

