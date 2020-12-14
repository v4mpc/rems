from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rems_api.serializers import LocationSerializer, ArfSerializer, ErfSerializer
from rems_api.models import Location, Arf, Erf
from rest_framework import status
from django.http import Http404, HttpResponse, HttpResponseNotFound
import os
from pathlib import Path
from django.core.mail import send_mail

# TODO: Make authenication work


class ArfList(APIView, TokenAuthentication):
    # permission_classes = (IsAuthenticated, )

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
        arf = self.get_object(pk)
        serializer = ArfSerializer(arf, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        arf = self.get_object(pk)
        if arf.excel_sheet:
            module_dir = os.path.dirname(__file__)
            arf_path = os.path.join(module_dir, 'static/rems_api/')
            file_path = os.path.join(arf_path, arf.excel_sheet)
            try:
                os.remove(file_path)
            except OSError:
                pass
        arf.delete()  # erf-> on_delete_cascade
        return Response(status=status.HTTP_204_NO_CONTENT)


class ErfList(APIView, TokenAuthentication):
    # permission_classes = (IsAuthenticated, )

    def get(self, request):
        # TODO: List file according to lodgin user
        erfs = Erf.objects.all()
        serializer = ErfSerializer(erfs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ErfSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ErfDetail(APIView):
    def get_object(self, pk):
        try:
            return Erf.objects.get(pk=pk)
        except Erf.DoesNotExist:
            raise Http404

    def get(self, resquest, pk):
        erf = self.get_object(pk)
        serializer = ErfSerializer(erf)
        return Response(serializer.data)

    def put(self, request, pk):
        erf = self.get_object(pk)
        serializer = ErfSerializer(erf, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        erf = self.get_object(pk)
        # TODO: Delte erf in database and file in server
        if arf.excel_sheet:
            module_dir = os.path.dirname(__file__)
            erf_path = os.path.join(module_dir, 'static/rems_api/')
            file_path = os.path.join(arf_path, erf.excel_sheet)
            try:
                os.remove(file_path)
            except OSError:
                pass
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


class DownloadArf(APIView):

    def get_object(self, pk):
        try:
            return Arf.objects.get(pk=pk)
        except Arf.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        # generate file
        # send it
        # then delete with crone maybe not sure

        module_dir = os.path.dirname(__file__)
        arf_path = os.path.join(module_dir, 'static/rems_api/')
        file_path = os.path.join(arf_path, file_name)
        try:
            with open(file_path, 'rb') as f:
                file_data = f.read()
                response = HttpResponse(
                    file_data, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        except IOError:
            response = Response(status=status.HTTP_204_NO_CONTENT)
        return response


class PrintArf(APIView):

    def get(self, request):
        send_mail(
            'Subject here',
            'Here is the message.',
            'from@example.com',
            ['to@example.com'],
            fail_silently=False,
        )
