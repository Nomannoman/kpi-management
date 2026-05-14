from .views import ProjectListViewSet
from django.urls import path,include
from rest_framework import routers

router = routers.DefaultRouter()

router.register('',ProjectListViewSet, basename='projectlist')

urlpatterns = [
    path('',include(router.urls))
]