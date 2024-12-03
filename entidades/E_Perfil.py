from io import BytesIO
import base64

class E_Perfil:

    def __init__(self, idPerfil=0, idUsuario=0, idNivel=0,nombre = '',progreso=0, descripcion='', foto=None):
        self.IdPerfil = idPerfil
        self.IdUsuario = idUsuario
        self.IdNivel = idNivel
        self.Nombre = nombre
        self.Progreso = progreso
        self.Descripcion = descripcion
        self.Foto = foto

    def getImg(self):
        archivo_base64 = None
        content_type = None

        content_type = self.Foto.content_type
        
        if content_type.startswith('image/'):
            with BytesIO(self.Foto.read()) as buffer:
                archivo_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

        
        return f'data:{content_type};base64,{archivo_base64}'
       