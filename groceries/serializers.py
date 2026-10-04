from rest_framework import serializers

from groceries.models import Item


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ("id", "name",)
        read_only_fields = ("id",)


class ItemPKSerializer(serializers.Serializer):

    items = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), many=True)