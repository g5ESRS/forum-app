from rest_framework import permissions

class DjangoModelPermissionsEnforceGET(permissions.DjangoModelPermissions):
    """
    Extends DjangoModelPermissions to enforce 'view' permission for GET requests.
    """

    def has_permission(self, request, view):
        # Ensure GET requests also check for 'view' permission
        if request.method in permissions.SAFE_METHODS:
            self.perms_map['GET'] = ['%(app_label)s.view_%(model_name)s']
        
        return super().has_permission(request, view)