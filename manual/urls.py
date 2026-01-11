# manual/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('faults/', views.faults_list, name='faults_list'),
    path('diagnostic/', views.diagnostic_start, name='diagnostic_start'),
    path('maintenance/', views.maintenance, name='maintenance'),
    path('knowledge/', views.knowledge_base, name='knowledge_base'),
]