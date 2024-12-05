import pyodbc

server = 'harmonyteds.database.windows.net' 
database = 'harmonyhub'         
username = 'ramon'                     
password = 'R123456789.'   

class Conexion:
    
    def __init__(self):
        self.con_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password}'
        self.conexion = None
    
    def abrirConexion(self):
        try:
            if not self.conexion or self.conexion.closed:
                self.conexion = pyodbc.connect(self.con_str)
        except Exception as ex:
            print(f"Error al abrir la conexión: {ex}")

    
    
    def cerrarConexion(self):
        try:
            if self.conexion and not self.conexion.closed:
                self.conexion.close()
        except Exception as ex:
            print(f"Error al cerrar la conexión: {ex}")
