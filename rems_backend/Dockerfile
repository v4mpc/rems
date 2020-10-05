FROM python:3.6.9
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN pip install pipenv


COPY Pipfile Pipfile.lock ./

RUN pipenv install

COPY . ./

EXPOSE 8000   


CMD python manage.py runserver 0.0.0.0:8000



