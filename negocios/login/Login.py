import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..')))

import bcrypt

from datos.D_Usuario import D_Usuario
from datos.D_Perfil import D_Perfil
from entidades.E_Usuario import E_Usuario

class Login:
    
    def __init__(self):
        self.DU = D_Usuario()
        self.DP = D_Perfil()
        
    def iniciarSesion(self,usuario):
        msg = ''
        
        usuarios = self.DU.buscarUsuarioPorCorreo(usuario.Correo)
        if len(usuarios) == 0:
            msg += 'Correo no registrado'
                
        if not self.validarPassword(usuario.Password,usuarios[0].Password):
            msg += 'Contraseña invalida'
        
        if msg != '':
            return msg
        
        return usuarios[0].IdUsuario
    
    def validarPassword(self, password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

