from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class FlexibleSlugOrIdField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        queryset = self.get_queryset()
        model = queryset.model

        # First try slug lookup:
        try:
            return super().to_internal_value(data)
        except (model.DoesNotExist, serializers.ValidationError, TypeError, ValueError):
            # If that fails, try primary key:
            try:
                return queryset.get(pk=data)
            except model.DoesNotExist:
                raise ValidationError(f"Object with slug or ID '{data}' does not exist.")
