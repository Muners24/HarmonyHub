from django import forms


class UsuarioForm(forms.Form):
    correo = forms.EmailField(label="Correo", max_length=255, initial="")
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput(attrs={'placeholder' : 'Tu contraseña'}), initial="" )
    confirm_password = forms.CharField(label="Confirmar Contraseña", initial="", widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        
        return cleaned_data


# Opciones de nivel (ID y descripción)
NIVEL_CHOICES = [
    (1, 'Principiante'),
    (2, 'Intermedio'),      
    (3, 'Avanzado'),
]

class PerfilForm(forms.Form):
    nivel = forms.ChoiceField(
        choices=NIVEL_CHOICES,  # Define las opciones para el desplegable
        label="Nivel",
        widget=forms.Select,  # Renderiza como menú desplegable
    )
    userName = forms.CharField(
        label="Nombre de Usuario", 
        max_length=100, 
        required=True,
        initial="",
    )
    descripcion = forms.CharField(label="Descripción", max_length=255, required=False, initial="")
    foto = forms.ImageField(label="Foto", required=False)
    


class LoginForm(forms.Form):
    correo = forms.EmailField(label="Correo electrónico", required=True)
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput(attrs={'placeholder' : 'Tu contraseña'}), required=True)