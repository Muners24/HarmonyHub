import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))
from datos.Conexion import Conexion
from entidades.E_Perfil import E_Perfil

class D_Perfil(Conexion):
    
    def __init__(self):
        super().__init__()
    
    def registrarPerfil(self,perfil):
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL RegistrarPerfil (?, ?, ?, ?, ?)}", (
                perfil.IdUsuario, 
                perfil.IdNivel,
                0,
                perfil.Descripcion,
                perfil.Foto))
            
            self.conexion.commit()
        
            return True
        
        except Exception as ex:
            print(f"Error al insertar perfil: {ex}")
            return False
            
        finally:
            self.cerrarConexion()
            
