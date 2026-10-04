from typing import cast

from django.db.models import QuerySet

from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from groceries.models import Item
from groceries.serializers import ItemPKSerializer, ItemSerializer


class ItemViewset(ListModelMixin, UpdateModelMixin, GenericViewSet):

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [SearchFilter]
    search_fields = ["name"] #* the name of the query_param must be `SearchFilter.search_param` ("search")

    def get_queryset(self) -> QuerySet[Item]:
        qs = cast(QuerySet[Item], super().get_queryset())
        if self.action == "list":
            return qs.filter(on_list=True)
        if self.action == "selectable":
            return qs.filter(on_list=False)
        return qs

    def get_object(self) -> Item:
        """For typing."""
        return super().get_object()

    @action(detail=False, methods=['get'])
    def selectable(self, *args, **kwargs) -> Response:
        """Get all items that can be selected to put on groceries list."""
        return self.list(*args, **kwargs)

    @action(detail=True, methods=['post'])
    def on_list(self, *args, **kwargs) -> Response:
        """Set an item on the groceries list.
        Returns this item in the response.
        """
        item = self.get_object()
        item.on_list = True
        item.save()
        return Response(ItemSerializer(item).data, 200)

    @action(detail=False, methods=["post"])
    def finsih(self, request: Request, *args, **kwargs) -> Response:
        """Remove grabbed Items from groceries list.
        Returns the cleansed items as response.
        """
        request_ser = ItemPKSerializer(data=request.data)  # data = [Item.pk]
        request_ser.is_valid(raise_exception=True)

        Item.objects.filter(pk__in=request.data["items"]).update(on_list=False)
        return Response(
            ItemSerializer(Item.objects.filter(on_list=True), many=True).data,
            200
        )
