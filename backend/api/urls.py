from django.urls import path
from . import views
urlpatterns=[
    path('getTodos/',views.get_todo),
    path('getTodo/<int:pk>',views.change_todo),
    path('addTodo/',views.add_todo),
]