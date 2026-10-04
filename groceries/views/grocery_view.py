from django.views.generic import ListView

from groceries.models import Item

class GroceriesView(ListView):
    template_name='groceries/groceries.html'
    model = Item
    context_object_name = "items"

    def get_queryset(self):
        return Item.objects.filter(on_list=True)
