from django.shortcuts import render, redirect
from .forms import UsuarioForm, PerfilForm, LoginForm
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from negocios.registro.Registro import Registro
from negocios.login.Login import Login
from entidades.E_Usuario import E_Usuario
from entidades.E_Perfil import E_Perfil
import base64
import io

def registrar(request):
    if request.method == 'POST':
        usuario_form = UsuarioForm(request.POST)
        perfil_form = PerfilForm(request.POST, request.FILES)

        if usuario_form.is_valid() and perfil_form.is_valid():
            NR = Registro()

            correo = usuario_form.cleaned_data['correo']
            password = usuario_form.cleaned_data['password']

            id_usuario = NR.registrarUsuario(
                usuario=E_Usuario(correo=correo, password=password)
            )

            print(f'Usuario registrado con id: {id_usuario}')

            if isinstance(id_usuario, str):  
                return render(request, 'register.html', {
                    'usuario_form': usuario_form,
                    'perfil_form': perfil_form,
                    'error_message': id_usuario
                })

            # Obtener los datos del perfil
            nivel = int(perfil_form.cleaned_data['nivel'])
            userName = perfil_form.cleaned_data['userName']
            descripcion = perfil_form.cleaned_data['descripcion']
            foto = perfil_form.cleaned_data['foto']
          
            NR.registrarPerfil(
                perfil=E_Perfil(
                    idUsuario=id_usuario,
                    idNivel=nivel,
                    nombre=userName,
                    progreso=0,
                    descripcion=descripcion,
                    foto=foto
                )
            )

            return redirect('login') 

    else:
        usuario_form = UsuarioForm()
        perfil_form = PerfilForm()

    return render(request, 'register.html', {
        'usuario_form': usuario_form,
        'perfil_form': perfil_form,
    })



def login(request):
    request.session['IdUsuario'] = None

    error_message = ""
    
    if request.method == 'POST':
        form = LoginForm(request.POST)
        
        if form.is_valid():
            correo = form.cleaned_data['correo']
            password = form.cleaned_data['password']
            
            NL = Login()
            resultado = NL.iniciarSesion(
                usuario=E_Usuario(correo=correo, password=password)
            )
            
            if isinstance(resultado, str):  # Si hay un mensaje de error
                error_message = resultado
            else:
                request.session['IdUsuario'] = resultado
                return redirect('/inicio/')  
    
    else:
        form = LoginForm()
    
    return render(request, 'login.html', {'form': form, 'error_message': error_message})

def logout(request):
    request.session['IdUsuario'] = None
    
    return redirect(login)  

def tologin(request):
    
    return redirect(logout)  
    