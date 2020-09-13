from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


class HelloView(APIView, TokenAuthentication):
    # permission_classes = (IsAuthenticated, )
    keyword = "Bearer"

    def get(self, request):
        print(request.user)
        content = {'message': 'Hello, World!'}
        return Response(content)


class ArfList(APIView):
    pass


class ArfDetail(APIView):
    pass
