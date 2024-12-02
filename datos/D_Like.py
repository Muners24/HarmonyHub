import sys
import os
import pickle 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from datos.Conexion import Conexion
from entidades.E_Like import E_Like

class D_Like(Conexion):

    def __init__(self):
        super().__init__()

    def insertarLike(self,like: E_Like) -> bool:
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            cursor.execute( "{CALL InsertarLike (?, ?)}",(like.IdParticipacion,like.IdUsuario))

            cursor.commit()
            
            print('like registrado')
            return True
        
        except Exception as ex:
            print(f"Error al insertar like: {ex}")
            return False
        
        finally:
            self.cerrarConexion()
        
    def buscarLike(self,like: E_Like) -> E_Like | None:
        likeObtenido = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarLike (?,?)}",(like.IdParticipacion,like.IdUsuario))

            row = cursor.fetchone()
            if row:       
                likeObtenido = E_Like(idLike=row[0],idParticipacion=row[1],idUsuario=row[2])           

        except Exception as ex:
            print(f"Error al buscar like: {ex}")
        
        finally:
            self.cerrarConexion()
            return likeObtenido
        
    def borrarLike(self,like: E_Like) -> bool:
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute( "{CALL BorrarLike (?, ?)}",(like.IdParticipacion,like.IdUsuario))
            cursor.commit()
            return True
        
        except Exception as ex:
            print(f"Error al borrar like: {ex}")
            return False
        
        finally:
            self.cerrarConexion()
            
    def contarLikes(self,idParticipacion: int)-> int:
        count = 0
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL ContarLikes (?)}",(idParticipacion))

            count = cursor.fetchval()
      
        except Exception as ex:
            print(f"Error al contar likes: {ex}")
        
        finally:
            self.cerrarConexion()
            return count