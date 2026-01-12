#!/bin/bash
# build.sh
set -o errexit

# Установка зависимостей
pip install -r requirements.txt

# Сборка статических файлов
python manage.py collectstatic --noinput

# Применение миграций
python manage.py migrate