from django.contrib import admin
from django.urls import path
from rems_api import views
from rest_framework.authtoken import views as rest_views
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('locations/', views.LocationList.as_view(), name='location_list'),
    path('locations/<int:pk>/', views.LocationDetail.as_view()),

    path('arfs/', views.ArfList.as_view(), name='arf_list'),
    path('arfs/<int:pk>/', views.ArfDetail.as_view()),
    path('download-arf/<str:file_name>/', views.DownloadArf.as_view()),





    # path('')
    url(r'^login/', rest_views.obtain_auth_token)
]
