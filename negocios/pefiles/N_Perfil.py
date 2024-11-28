import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import bcrypt

from datos.D_Perfil import D_Perfil
from entidades.E_Perfil import E_Perfil
from datos.D_Nivel import D_Nivel


class N_Perfil:

    def __init__(self):
        self.DP = D_Perfil()
        self.DN = D_Nivel()

    def buscarPerfilPorIdUsuario(self, id) -> E_Perfil:
        return self.DP.buscarPefilPorIdUsuario(id)

    def datosPerfil(self, idUsuario: int):
        perfil = self.DP.buscarPefilPorIdUsuario(idUsuario)

        if perfil == None:
            return {"error": "Perfil no encontrado"}

        nivel = self.DN.buscarNivelPorId(perfil.IdNivel)

        if nivel == None:
            return {"error": "Nivel invalido"}

        return {
            "nombre": perfil.Nombre,
            "descripcion": perfil.Descripcion,
            "img": perfil.getImg(),
            "nivel": nivel.Descripcion,
            "progreso": f"{perfil.Progreso}/{nivel.Progreso}",
            "porcentaje": perfil.Progreso * 100 / nivel.Progreso,
            "retos": None,
        }
