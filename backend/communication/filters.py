# filters.py
import django_filters
from communication.models import Message

class PrivateMessageFilter(django_filters.FilterSet):
    type = django_filters.CharFilter(method="filter_by_type")
    sender = django_filters.NumberFilter(field_name="sender__id", lookup_expr="exact")  # Added filter for sender
    is_read = django_filters.BooleanFilter(field_name="is_read")  # Added filter for is_read


    class Meta:
        model = Message
        fields = ['type', 'sender', 'is_read']  # Include is_read in the fields
        ordering_fields = ['created_at', 'is_read']

    def filter_by_type(self, queryset, name, value):
        user = self.request.user
        if value == "sent":
            return queryset.filter(sender=user)
        elif value == "received":
            return queryset.filter(receiver=user)
        return queryset