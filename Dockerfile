FROM python:3.6.9
ENV PYTHONUNBUFFERED 1

WORKDIR /app/rems_backend

RUN pip install pipenv


COPY Pipfile Pipfile.lock /app/

RUN pipenv install --system --deploy

COPY . /app

CMD python manage.py runserver 0.0.0.0:80





