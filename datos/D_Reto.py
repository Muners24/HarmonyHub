import sys
import os
import pickle 

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))
from datos.Conexion import Conexion
from entidades.E_Reto import E_Reto
from entidades.E_Partitura import E_Partitura

class D_Reto(Conexion):
    
    def __init__(self):
        super().__init__()
    
    def listarRetosSemanales(self):
        retos = []
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL ListarRetosSemanales }")
            
            rows = cursor.fetchall()
            
            for row in rows:
                retos.append(E_Reto(idReto=row[0],idPartitura=row[1],tiporeto=row[2],titulo=row[3],fecha=row[4]))
                    
        except Exception as ex:
            print(f"Error al listar retos: {ex}")
            
        finally:
            self.cerrarConexion()
            return retos

    def insertarReto(self,reto):
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()

            cursor.execute(
                "{CALL InsertarReto (?, ?, ?)}",
                (reto.IdPartitura,reto.TipoReto,reto.Titulo)
            )

            self.conexion.commit()
            return True

        except Exception as ex:
            print(f"Error al insertar reto: {ex}")
            return False

        finally:
            self.cerrarConexion()

    