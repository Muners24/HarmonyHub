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
        usuarios = []
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarUsuarioPorCorreo (?)}", (correo))
            
            rows = cursor.fetchall()
            
            for row in rows:
                usuarios.append(E_Usuario(row[0],row[1],row[2]))
                
                   
        except Exception as ex:
            print(f"Error al buscar usuario: {ex}")
            
        finally:
            self.cerrarConexion()
            return usuarios
        
    def buscarUsuarioPorId(self,idUsuario):
        usuarios = []
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarUsuarioPorId (?)}", (idUsuario))
            
            rows = cursor.fetchall()
            
            for row in rows:
                usuarios.append(E_Usuario(row[0],row[1],row[2]))
                
                   
        except Exception as ex:
            print(f"Error al buscar usuario: {ex}")
            
        finally:
            self.cerrarConexion()
            return usuarios
        


