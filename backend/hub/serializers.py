from rest_framework import serializers

from .models import DigestItem, Package, SchoolEvent


class SchoolEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolEvent
        fields = ["id", "title", "date", "source", "notes"]


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ["id", "carrier", "status", "expected_date", "tracking_note"]


class DigestItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DigestItem
        fields = ["id", "category", "count"]
