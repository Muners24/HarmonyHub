import sys
import os
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.images import ImageFile

import cv2
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..')))
from datos.Conexion import Conexion
from entidades.E_Perfil import E_Perfil

class D_Perfil(Conexion):
    
    def __init__(self):
        super().__init__()
    
    def registrarPerfil(self,perfil: E_Perfil) -> bool:
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL RegistrarPerfil (?, ?, ?, ?, ?, ?)}", (
                perfil.IdUsuario, 
                perfil.IdNivel,
                perfil.Nombre,
                0,
                perfil.Descripcion,
                perfil.Foto.read()))
            
            self.conexion.commit()
            
            return True
        
        except Exception as ex:
            print(f"Error al insertar perfil: {ex}")
            return False
            
        finally:
            self.cerrarConexion()
    
    def buscarPefilPorIdUsuario(self,idUsuario:int) -> E_Perfil | None:
        perfil = None
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarPefilPorIdUsuario (?)}", (idUsuario))
            
            row = cursor.fetchone()
            
            perfil = E_Perfil(idPerfil=row[0],
                              idUsuario=row[1],
                              idNivel=row[2],
                              nombre=row[3],
                              progreso=row[4],
                              descripcion=row[5],
                              foto=row[6])
            
            
            image = Image.open(BytesIO(perfil.Foto))
            
            img_io = BytesIO()
            image.save(img_io, format='PNG')
            img_io.seek(0)

            perfil.Foto = InMemoryUploadedFile(
                img_io,
                None,
                'foto_perfil.png',
                'image/png',
                img_io.tell(),
                None 
            )
            
        except Exception as ex:
            print(f"Error al buscar usuario: {ex}")
            
        finally:
            self.cerrarConexion()
            return perfil

    def buscarPefilPorNombre(self,nombreUsuario: str) -> list:
        perfiles = []
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL BuscarPerfilPorNombre (?)}", (nombreUsuario))
            
            rows = cursor.fetchall()
            
            for row in rows:
                perfil = E_Perfil(idPerfil=row[0],
                                idUsuario=row[1],
                                idNivel=row[2],
                                nombre=row[3],
                                progreso=row[4],
                                descripcion=row[5],
                                foto=row[6])
            
            
                image = Image.open(BytesIO(perfil.Foto))
                
                img_io = BytesIO()
                image.save(img_io, format='PNG')
                img_io.seek(0)

                perfil.Foto = InMemoryUploadedFile(
                    img_io,
                    None,
                    'foto_perfil.png',
                    'image/png',
                    img_io.tell(),
                    None 
                )
                
                perfiles.append(perfil)
                
        except Exception as ex:
            print(f"Error al buscar perfiles: {ex}")
            
        finally:
            self.cerrarConexion()
            return perfiles
        
    def perfilesListosParaSubirNivel(self) -> list:
        idPerfiles = []
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute( "{CALL PerfilesListosParaSubirNivel }")

            rows = cursor.fetchall()
            
            for row in rows:
                idPerfiles.append(row[0])           

        
        except Exception as ex:
            print(f"Error al buscar perfiles listos para nivel: {ex}")
        
        finally:
            self.cerrarConexion()
            return idPerfiles
        
    
    def subirNivel(self, idPerfil: int) -> bool:
        try:
            self.abrirConexion()
            cursor = self.conexion.cursor()
            
            cursor.execute("{CALL SubirNivel (?)}", (idPerfil))
            
            self.conexion.commit()
            
            return True
        
        except Exception as ex:
            print(f"Error al insertar perfil: {ex}")
            return False
            
        finally:
            self.cerrarConexion()
        