import pyodbc
import sys
import os
import pickle 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from datos.Conexion import Conexion
from entidades.E_Partitura import E_Partitura

class D_Partitura(Conexion):

    def __init__(self):
        super().__init__()

    def insertarPartitura(self, partitura):
        idPartitura = None
        
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()

            notacion_binario = pickle.dumps(partitura.Notacion)
            
            
            cursor.execute(
                "{CALL InsertarPartitura (?, ?, ?)}",
                (partitura.Titulo, partitura.Compositor, notacion_binario)
            )
            
            
            idPartitura = cursor.fetchval()
            self.conexion.commit()
        
        
        except Exception as ex:
            print(f"Error al insertar partitura: {ex}")
            
        finally:
            self.cerrarConexion()
            return idPartitura

    def buscarPartituraPorId(self,id):
        partitura = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()

            cursor.execute("{CALL BuscarPartituraPorId (?)}",(id))
            
            rows = cursor.fetchall()
            
            for row in rows:
                partitura = E_Partitura(idPartitura=row[0],titulo=row[1],compositor=row[2],notacion=pickle.loads(row[3]))

            self.conexion.commit()
            
        except Exception as ex:
            print(f"Error al buscar partitura: {ex}")

        finally:
            self.cerrarConexion()
            return partitura

    def buscarPartituraPorTipoReto(self,tipo):
        partitura = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarRetoActualPorTipo (?) }",(tipo))
            
            rows = cursor.fetchall()
        
            for row in rows:
                partitura = E_Partitura(idPartitura=row[0],titulo=row[1],compositor=row[2],notacion=pickle.loads(row[3]))
                    
        except Exception as ex:
            print(f"Error al buscar partitura de reto: {ex}")
            
        finally:
            self.cerrarConexion()
            return partitura
    
    def buscarPartituraPorIdReto(self,id):
        partitura = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarPartituraPorIdReto (?) }",(id))
            
            rows = cursor.fetchall()
        
            for row in rows:
                partitura = E_Partitura(idPartitura=row[0],titulo=row[1],compositor=row[2],notacion=pickle.loads(row[3]))
                    
        except Exception as ex:
            print(f"Error al buscar partitura de reto: {ex}")
            
        finally:
            self.cerrarConexion()
            return partitura
        