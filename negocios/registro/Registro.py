import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))

import bcrypt

from datos.D_Usuario import D_Usuario
from datos.D_Perfil import D_Perfil
from entidades.E_Usuario import E_Usuario

class Registro:
    
    def __init__(self):
        self.DU = D_Usuario()
        self.DP = D_Perfil()
    
    def registrarUsuario(self,usuario):
        msg = ''
        
        if len(self.DU.buscarUsuarioPorCorreo(usuario.Correo)) > 0:
            msg += 'Este correo ya esta registrado'
        
        if msg != '':
            return msg
        
        usuario.Password = self.encriptarPassword(usuario.Password) 
        self.DU.registrarUsuario(usuario)
    
        return self.DU.buscarUsuarioPorCorreo(usuario.Correo)[0].IdUsuario
    
    def registrarPerfil(self,perfil):
        msg = ''
        if len(self.DU.buscarUsuarioPorId(perfil.IdUsuario)):
            msg = 'Usuario invalido'
        
        if msg != '':
            return msg
        
        self.DP.registrarPerfil(perfil)
        
        
    def encriptarPassword(self, password: str) -> str:
 
        salt = bcrypt.gensalt()  
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    

