from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import todoList
from .serializer import todoListSerializer



@api_view(['GET'])
def get_todo(request):
    todos=todoList.objects.all()
    serializedData=todoListSerializer(todos,many=True).data
    return Response(serializedData)

@api_view(['POST'])
def add_todo(request):
    data=request.data
    serializer =todoListSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
@api_view(['PUT','DELETE','GET'])
def change_todo(request,pk):
    try:
        todo = todoList.objects.get(index=pk) 
    except todoList.DoesNotExist:
        return Response({"error": "todo not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method=='PUT':
        
        data=request.data
        serializer =todoListSerializer(todo,data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        serializedtodo = todoListSerializer(todo).data
        return Response(serializedtodo, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        todo.delete()
        return Response({"message": "Todo deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
