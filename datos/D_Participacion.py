import sys
import os
import pickle 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from datos.Conexion import Conexion
from entidades.E_Participacion import E_Participacion

class D_Participacion(Conexion):

    def __init__(self):
        super().__init__()

    def insertarParticipacion(self, participacion: E_Participacion):
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute(
                "{CALL InsertarParticipacion (?, ?, ?, ?, ?)}",
                (participacion.IdUsuario,
                 participacion.IdPartitura,
                 participacion.IdReto,
                 participacion.Titulo,
                 0),
            )

            self.conexion.commit()
            
            return True
        
        except Exception as ex:
            print(f"Error al insertar participacion: {ex}")
            return False
        
        finally:
            self.cerrarConexion()

  