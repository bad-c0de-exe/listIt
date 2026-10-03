from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response

from groceries.models import Item
from groceries.serializers import ItemSerializer


class ItemViewset(ListModelMixin, UpdateModelMixin, GenericViewSet):

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [SearchFilter]
    search_fields = ["name"] #* the name of the query_param must be `SearchFilter.search_param` ("search")

    def get_queryset(self):
        if self.action == "selectable":
            return super().get_queryset().filter(is_selected=False)
        return super().get_queryset()

    def get_object(self) -> Item:
        """For typing."""
        return super().get_object()

    @action(detail=False, methods=['get'])
    def selectable(self, request, *args, **kwargs):
        """Get all items that can be selected to put on groceries list."""
        return self.list(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def on_list(self, *args, **kwargs):
        """Set an item on the groceries list."""
        item = self.get_object()
        item.is_selected = True
        item.save()
        return Response(200)