from .views import KPIViewSet
from django.urls import path,include
from rest_framework import routers

router = routers.DefaultRouter()

router.register('',KPIViewSet, basename='projectlist')

urlpatterns = [
    path('',include(router.urls))
]