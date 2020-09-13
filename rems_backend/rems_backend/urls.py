from django.contrib import admin
from django.urls import path
from rems_api import views
from rest_framework.authtoken import views as rest_views
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', views.HelloView.as_view(), name='hello'),
    # path('')
    url(r'^login/', rest_views.obtain_auth_token)
]
