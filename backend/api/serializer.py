from rest_framework import serializers
from .models import todoList
class todoListSerializer(serializers.ModelSerializer):
    class Meta:
        model=todoList
        fields='__all__'