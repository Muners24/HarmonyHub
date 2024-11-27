import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))

import bcrypt

from datos.D_Usuario import D_Usuario
from datos.D_Perfil import D_Perfil
from entidades.E_Usuario import E_Usuario
from entidades.E_Perfil import E_Perfil

class Registro:
    
    def __init__(self):
        self.DU = D_Usuario()
        self.DP = D_Perfil()
    
    def registrarUsuario(self,usuario):
        msg = ''
        
        if self.DU.buscarUsuarioPorCorreo(usuario.Correo) != None:
            msg += 'Este correo ya esta registrado'
        
        usuario.Password = self.encriptarPassword(usuario.Password) 
        if not self.DU.registrarUsuario(usuario):
            msg += '\nError al reigstrar usuario'

        if msg != '':
            return msg
        
        return self.DU.buscarUsuarioPorCorreo(usuario.Correo).IdUsuario
    
    def registrarPerfil(self,perfil : E_Perfil):
        msg = ''
        if self.DU.buscarUsuarioPorId(perfil.IdUsuario) == None:
            msg = 'Usuario invalido'
        
        if msg != '':
            return msg
        
        self.DP.registrarPerfil(perfil)
        
        
    def encriptarPassword(self, password: str) -> str:
 
        salt = bcrypt.gensalt()  
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    

