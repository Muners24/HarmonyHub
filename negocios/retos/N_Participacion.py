import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from datos.D_Participacion import D_Participacion
from entidades.E_Participacion import E_Participacion
from datos.D_Reto import D_Reto
from datos.D_Partitura import D_Partitura
from datos.D_Like import D_Like
from datos.D_Perfil import D_Perfil

class N_Participacion:

    def __init__(self):
        self.DParticipacion = D_Participacion()
        self.DR = D_Reto()
        self.DPartitura = D_Partitura()
        self.DL = D_Like()
        self.DPerfil = D_Perfil()

    def participar(self,participacion: E_Participacion):
        return self.DParticipacion.insertarParticipacion(participacion)
    
    def getParticipaciones(self,idUsuario:int):
        participaciones = self.DParticipacion.buscarParticipacionesPorIdUsario(idUsuario)
        
        participacionesJson = []
        
        for participacion in participaciones:
            reto = self.DR.buscarRetoPorId(participacion.IdReto)
            
            if reto == None:
                return {'error': 'Reto invalido'}
            
            partitura = self.DPartitura.buscarPartituraPorId(participacion.IdPartitura)

            if partitura == None:
                return {'error': 'Partitura no encontrada'}
            
            likes = self.DL.contarLikes(participacion.IdParticipacion)
            
            participacionesJson.append({
                'id' : participacion.IdParticipacion,
                'titulo' : participacion.Titulo,
                'compositor': partitura.Compositor,
                'tipo': reto.TipoReto,
                'likes': likes,
            })
        
        return {'participaciones': participacionesJson,'error':None}
    
    def getParticipacionesPorTexto(self,texto:str):
        
        participaciones = self.DParticipacion.buscarParticipacionesPorTexto(texto)
        
        participacionesJson = []
        
        for participacion in participaciones:
            reto = self.DR.buscarRetoPorId(participacion.IdReto)
            
            if reto == None:
                return {'error': 'Reto invalido'}
            
            partitura = self.DPartitura.buscarPartituraPorId(participacion.IdPartitura)

            if partitura == None:
                return {'error': 'Partitura no encontrada'}
            
            likes = self.DL.contarLikes(participacion.IdParticipacion)
            
            participacionesJson.append({
                'id' : participacion.IdParticipacion,
                'titulo' : participacion.Titulo,
                'compositor': partitura.Compositor,
                'tipo': reto.TipoReto,
                'likes': likes,
            })
        
        error = None
        if len(participacionesJson) == 0:
            error = 'No se encontraron participaciones'
        
        return {'participaciones': participacionesJson , 'error': error}
    
    def getParticipacionPorId(self,idParticipacion:int):
        
        retosActuales = self.DR.listarRetosSemanales()
        
        participacion = self.DParticipacion.buscarParticipacionPorId(idParticipacion)
        
        if participacion == None:
            return {'error':'Participacion no encontrada'}
            
        reto = self.DR.buscarRetoPorId(participacion.IdReto)
            
        if reto == None:
            return {'error': 'Reto no encontrado'}
        
        votable = any(r.IdReto == reto.IdReto for r in retosActuales)

        partitura = self.DPartitura.buscarPartituraPorId(participacion.IdPartitura)

        if partitura == None:
            return {'error': 'Partitura no encontrada'}
        
        participacionJson = {
            'id' : participacion.IdParticipacion,
            'titulo' : participacion.Titulo,
            'compositor': partitura.Compositor,
            'notacion': partitura.Notacion,
        }
        
        return {'participacion': participacionJson ,'votable': votable, 'error': None}
    
    def getResultado(self):
        participaciones = self.DParticipacion.listarParticipacionesAnteriores()
        
        participacionesJson = []
        
        for participacion in participaciones:
            
            perfil = self.DPerfil.buscarPefilPorIdUsuario(participacion.IdUsuario)
            
            if perfil == None:
                continue
            
            reto = self.DR.buscarRetoPorId(participacion.IdReto)
            
            if reto == None:
                continue
            
            partitura = self.DPartitura.buscarPartituraPorId(participacion.IdPartitura)
            
            if partitura == None:
                continue
            
            
            likes = self.DL.contarLikes(participacion.IdParticipacion)
            
            participacionesJson.append({
                'id': participacion.IdParticipacion,
                'img':perfil.getImg(),
                'tituloReto' : reto.Titulo,
                'tipoReto' : reto.TipoReto,
                'titulo': participacion.Titulo,
                'compositor': partitura.Compositor,
                'likes': likes,
                'calificacion':participacion.Calificacion,
            })
            
        error = None
        if len(participacionesJson) == 0:
            error = 'No hay participaciones registradas'
            
        return {'participaciones': participacionesJson,'error': error}