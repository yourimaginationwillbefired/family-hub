from rest_framework import viewsets

from .models import DigestItem, Package, SchoolEvent
from .serializers import (
    DigestItemSerializer,
    PackageSerializer,
    SchoolEventSerializer,
)


class SchoolEventViewSet(viewsets.ModelViewSet):
    queryset = SchoolEvent.objects.all()
    serializer_class = SchoolEventSerializer


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer


class DigestItemViewSet(viewsets.ModelViewSet):
    queryset = DigestItem.objects.all()
    serializer_class = DigestItemSerializer
