import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))
from datos.Conexion import Conexion
from entidades.E_Usuario import E_Usuario

class D_Usuario(Conexion):
    
    def __init__(self):
        super().__init__()
    
    
    def registrarUsuario(self,usuario):
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL RegistrarUsuario (?, ?)}", (
                usuario.Correo, 
                usuario.Password))
            
            self.conexion.commit()
        
            return True
        
        except Exception as ex:
            print(f"Error al insertar usuario: {ex}")
            return False
            
        finally:
            self.cerrarConexion()
            
    def buscarUsuarioPorCorreo(self,correo):
        usuario = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarUsuarioPorCorreo (?)}", (correo))
            
            row = cursor.fetchone()
  
            usuario = E_Usuario(idUsuario=row[0],correo=row[1],password=row[2])
                
                   
        except Exception as ex:
            print(f"Error al buscar usuario: {ex}")
            
        finally:
            self.cerrarConexion()
            return usuario
        
    def buscarUsuarioPorId(self,idUsuario):
        usuario = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            
            cursor.execute("{CALL BuscarUsuarioPorId (?)}", (idUsuario))
            
            row = cursor.fetchone()
  
            usuario = E_Usuario(idUsuario=row[0],correo=row[1],password=row[2])
                
                   
        except Exception as ex:
            print(f"Error al buscar usuario: {ex}")
            
        finally:
            self.cerrarConexion()
            return usuario
        


