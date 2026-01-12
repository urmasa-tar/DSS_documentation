# Локально:
pip freeze > requirements.txt
git add .
git commit -m "Ready for deploy"
git push

# На PythonAnywhere (в консоли):
cd ~
git clone https://github.com/ваш_username/репозиторий.git
cd репозиторий
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
