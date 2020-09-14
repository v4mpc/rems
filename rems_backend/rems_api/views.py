from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rems_api.serializers import LocationSerializer, ArfSerializer
from rems_api.models import Location, Arf
from rest_framework import status
from django.http import Http404

# TODO: Make authenication work


class HelloView(APIView, TokenAuthentication):
    # permission_classes = (IsAuthenticated, )
    keyword = "Bearer"

    def get(self, request):
        print(request.user)
        content = {'message': 'Hello, World!'}
        return Response(content)


class ArfList(APIView):

    def get(self, request):
        # TODO: List file according to lodgin user
        arfs = Arf.objects.all()
        serializer = ArfSerializer(arfs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ArfSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArfDetail(APIView):
    def get_object(self, pk):
        try:
            return Arf.objects.get(pk=pk)
        except Arf.DoesNotExist:
            raise Http404

    def get(self, resquest, pk):
        arf = self.get_object(pk)
        serializer = ArfSerializer(arf)
        return Response(serializer.data)

    def put(self, request, pk):
        # TODO: Finish put method check this(https://www.django-rest-framework.org/api-guide/serializers/)
        arf = self.get_object(pk)
        serializer = ArfSerializer(arf, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        arf = self.get_object(pk)
        # TODO: Delete file too
        arf.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LocationList(APIView):

    def get(self, request):
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LocationDetail(APIView):

    def get_object(self, pk):
        try:
            return Location.objects.get(pk=pk)
        except Location.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        locations = self.get_object(pk)
        serializer = LocationSerializer(locations)
        return Response(serializer.data)

    def put(self, request, pk):
        location = self.get_object(pk)
        serializer = LocationSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        location = self.get_object(pk)
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
