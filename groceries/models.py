from django.db import models

from base.models import List


class Item(models.Model):
    name = models.CharField(max_length=30, unique=True)
    list = models.ForeignKey(
        List,
        on_delete=models.CASCADE
    )
    on_list = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
    def save(self, *arg, **kwargs):

        if not self.pk:
            groceries = List.objects.get(name="groceries")
            self.list = groceries

        super().save(*arg, **kwargs)
