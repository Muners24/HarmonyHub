import sys
import os
import pickle 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from datos.Conexion import Conexion
from entidades.E_Nivel import E_Nivel


class D_Nivel(Conexion):

    def __init__(self):
        super().__init__()

    def buscarNivelPorId(self, id):
        nivel = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute( "{CALL BuscarNivelPorId (?)}",(id))

            row = cursor.fetchone()
            
            nivel = E_Nivel(idNivel=row[0],descripcion=row[1],progreso=row[2])           

        
        except Exception as ex:
            print(f"Error al buscar nivel: {ex}")
        
        finally:
            self.cerrarConexion()
            return nivel
        
    def subirNivel(self, idPerfil: int) -> bool:
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL SubirNivel (?)}", (idPerfil))
            
            self.conexion.commit()
            
            return True
        
        except Exception as ex:
            print(f"Error al subir de nivel: {ex}")
            return False
            
        finally:
            self.cerrarConexion()
        

  