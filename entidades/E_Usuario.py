
class E_Usuario:
    
    def __init__(self,idUsuario = 0,correo = '',password = ''):
        self.IdUsuario = idUsuario
        self.Correo = correo
        self.Password= password
    
    def __str__(self):
        
        return f'{self.IdUsuario} {self.Correo} {self.Password}'