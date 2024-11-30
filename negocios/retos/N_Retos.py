import sys
import os
import time
import json
import openai

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from entidades.E_Reto import E_Reto
from entidades.E_Partitura import E_Partitura
from datos.D_Reto import D_Reto
from datos.D_Participacion import D_Participacion
from datos.D_Partitura import D_Partitura

from key import KEY

openai.api_key = KEY

class N_Retos:

    def __init__(self):
        self.DR = D_Reto()
        self.DP = D_Participacion()
        self.DPartitura = D_Partitura()
        
    def getRetos(self):
        retos = self.DR.listarRetosSemanales()
        
        while len(retos) < 3:
            self.generarReto('Melódico')
            self.generarReto('Armónico')
            self.generarReto('Rítmico')
        
            retos = self.DR.listarRetosSemanales()

        return retos

    def participar(self,participacion):
        return self.DP.insertarParticipacion(participacion)
    
    
    def generarReto(self, tipoReto):
        prompt = self.getPromt(tipoReto)
        
        respuesta = self.openaiReto(prompt)
        
        print(respuesta)
        
        titulo = respuesta['titulo']
        notacion= {
            "tempo": respuesta['tempo'],
            "numerator": respuesta['numerator'],
            "denominator": respuesta['denominator'],
            "notas": respuesta['notas']
        }
           
            
        idPartitura = self.DPartitura.insertarPartitura(
            E_Partitura(
                idPartitura=0,
                titulo=titulo,
                compositor='HarmonyHub',
                notacion=notacion
            )
        )
                
        self.DR.insertarReto(
            E_Reto(
                idReto=0,
                idPartitura=idPartitura,
                tiporeto=tipoReto,
                titulo=titulo
            )
        )


    def openaiReto(self, prompt, model="gpt-4", temperature=0.7, max_tokens=1500):
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "Eres un asistente experto en música."},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            content = response["choices"][0]["message"]["content"].strip()
            
            try:
                result = json.loads(content)
                return result
            except json.JSONDecodeError:
                return f"Error: No se pudo procesar la respuesta JSON de la API."
        
        except Exception as e:
            return f"Error al interactuar con la API: {e}"


    def getPromt(self, tipoReto):
        return (
            "Genera un reto musical " + tipoReto + " en formato JSON siguiendo las siguientes reglas:\n\n"
            "Tipos de Retos:\n"
            "- **Titulo**: Debe tener titulo corto relacionado con la notación\n"
            "1. **Rítmico**: Elige un compás y sólo cambia las duraciones y añade silencios. La nota base debe ser la misma en todo el reto.\n"
            "2. **Armónico**: Usa varias keys por nota (cuerdas simultáneas) y duraciones que correspondan al compás.\n"
            "3. **Melódico**: Usa un único key por nota y cualquier ritmo correspondiente al compás con duraciones y silencios.\n\n"
            "- **Tempo**: Elige uno de los tempos predefinidos: `60`, `90`, `120`, o `140` BPM.\n"
            "- **Compás**: Define el compás usando las opciones: `4/4`, `3/4`, o `6/8`.\n\n"
            "# Output Format\n\n"
            "El output debe estar en el siguiente formato **JSON**, sin envoltorios de bloques de código:\n\n"
            "{\n"
            " \"titulo\": [titulo]   \n"
            " \"tempo\": [tempo value],\n"
            " \"numerator\": [numerator value],\n"
            " \"denominator\": [denominator value],\n"
            " \"notas\": [\n"
            " {\n"
            " \"keys\": [\"[nota de la escala (por ejemplo, c/4)]\", ...],\n"
            " \"dur\": \"[duración de la nota: 4, 8, o 16]\"\n"
            " },\n"
            " ...\n"
            " ]\n"
            "}"
        )