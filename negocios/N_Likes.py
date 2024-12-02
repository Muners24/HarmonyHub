import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from datos.D_Like import D_Like
from entidades.E_Like import E_Like


class N_Like:

    def __init__(self):
        self.DL = D_Like()

    def registrarLike(self, like: E_Like) -> bool:
        if self.DL.buscarLike(like):
            return True
        
        return self.DL.insertarLike(like)

    def getLike(self, like: E_Like) -> E_Like | None:
        return self.DL.buscarLike(like)

    def borrarLike(self, like: E_Like) -> bool:
        return self.DL.borrarLike(like)
