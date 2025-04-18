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
    

class AnyReadOrDjangoPermission(permissions.DjangoModelPermissionsOrAnonReadOnly):
    """
    Allows any user (anonymous or authenticated) to perform safe (read-only) requests.
    Write permissions are only granted to users with Django model permissions.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)
    