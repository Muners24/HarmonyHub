from django.contrib import admin
from django.urls import path, include
from editor import views

urlpatterns = [
    path('',include('editor.urls'))
]


