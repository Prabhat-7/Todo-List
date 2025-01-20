from django.db import models

class todoList(models.Model):
    todo = models.CharField(max_length=100)  # Example field
    index = models.PositiveIntegerField()  # Add an index field

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        index = self.index
        super().delete(*args, **kwargs)
        # Shift indices of items after the deleted one
        todoList.objects.filter(index__gt=index).update(index=models.F('index') - 1)
