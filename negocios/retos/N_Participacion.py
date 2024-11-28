import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from datos.D_Participacion import D_Participacion
from entidades.E_Participacion import E_Participacion
from datos.D_Reto import D_Reto
from datos.D_Partitura import D_Partitura

class N_Participacion:

    def __init__(self):
        self.DParticipacion = D_Participacion()
        self.DR = D_Reto()
        self.DPartitura = D_Partitura()

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
            
            participacionesJson.append({
                'titulo' : participacion.Titulo,
                'compositor': partitura.Compositor,
                'tipo': reto.TipoReto,
                'likes': 0,
                'error': None
            })
        
        return {'participaciones': participacionesJson}
    
    