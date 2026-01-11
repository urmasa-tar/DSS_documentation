# manual/views.py
from django.shortcuts import render

def index(request):
    """Главная страница"""
    return render(request, 'manual/index.html')

def faults_list(request):
    """Список неисправностей"""
    return render(request, 'manual/faults.html')

def diagnostic_start(request):
    """Страница диагностического диалога"""
    return render(request, 'manual/diagnostic.html')

def maintenance(request):
    """Регламентные работы"""
    # Здесь позже добавим данные из БД
    maintenance_works = [
        {
            'id': 1,
            'title': 'Ежедневная проверка логов',
            'frequency': 'Ежедневно',
            'frequency_color': 'primary',
            'description': 'Анализ логов библиотеки на предмет ошибок',
            'period': 'Каждый день в 09:00',
            'duration': '15 минут',
            'tools': 'CLI, Система мониторинга'
        },
        # ... остальные работы
    ]
    return render(request, 'manual/maintenance.html', {
        'maintenance_works': maintenance_works
    })

def knowledge_base(request):
    """Справочная информация"""
    return render(request, 'manual/knowledge_base.html')