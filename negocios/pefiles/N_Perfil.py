import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import bcrypt

from datos.D_Perfil import D_Perfil
from entidades.E_Perfil import E_Perfil
from datos.D_Nivel import D_Nivel
from negocios.retos.N_Participacion import N_Participacion

class N_Perfil:

    def __init__(self):
        self.DP = D_Perfil()
        self.DN = D_Nivel()
        self.NP = N_Participacion()

    def buscarPerfilPorIdUsuario(self, idUsuario:int) -> E_Perfil:
        return self.DP.buscarPefilPorIdUsuario(idUsuario)

    def datosPerfil(self, idUsuario: int):
        perfil = self.DP.buscarPefilPorIdUsuario(idUsuario)

        if perfil == None:
            return {"error": "Perfil no encontrado"}

        nivel = self.DN.buscarNivelPorId(perfil.IdNivel)

        if nivel == None:
            return {"error": "Nivel invalido"}

        respuesta = self.NP.getParticipaciones(idUsuario)
        
        if respuesta.get('error') != None:
            return {"error": respuesta['error']}
        
        print(respuesta)
        
        return {
            "nombre": perfil.Nombre,
            "descripcion": perfil.Descripcion,
            "img": perfil.getImg(),
            "nivel": nivel.Descripcion,
            "progreso": f"{perfil.Progreso}/{nivel.Progreso}",
            "porcentaje": perfil.Progreso * 100 / nivel.Progreso,
            "participaciones": respuesta['participaciones'],
            "error": None
        }

    def buscarPerfiles(self,nombre):
        perfiles = self.DP.buscarPefilPorNombre(nombre)
        
        if len(perfiles) == 0:
            return {'error': 'No se encontraron coincidencias'}
        
        perfilesJson = []
        
        for perfil in perfiles:
            
            nivel = self.DN.buscarNivelPorId(perfil.IdNivel)
            
            if nivel == None:
                continue    
            
            perfilesJson.append({
                'idUsuario':perfil.IdUsuario,
                'nombre': perfil.Nombre,
                'nivel': nivel.Descripcion,
                'img': perfil.getImg(),
            })
  
        return {'perfiles': perfilesJson , 'error': None}
    
    