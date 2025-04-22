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
    


class IsOwner(permissions.BasePermission):
    """
    Allow access if user is the owner of the object,
    """
    # You can optionally customize this in your view
    owner_field = 'author'    # or 'owner', 'user', etc.

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Get the field dynamically
        owner = getattr(obj, getattr(view, 'owner_field', self.owner_field))

        # Check if current user is the owner
        return owner == request.user
            


#class IsOwnerOrHasPermission(permissions.DjangoModelPermissions):
#     """
#     Allow access if user is the owner of the object,
#     or has the specified model-level permission.
#     """

#     # You can optionally customize this in your view
#     owner_field = 'author'    # or 'owner', 'user', etc.

#     def has_permission(self, request, view):
#         if request.method in permissions.SAFE_METHODS:
#             self.perms_map["GET"] = ["%(app_label)s.view_%(model_name)s"]
#         return super().has_permission(request, view)

#     def has_object_permission(self, request, view, obj):
#         # Get the field dynamically
#         owner = getattr(obj, getattr(view, 'owner_field', self.owner_field))

#         # Check if current user is the owner
#         if owner == request.user:
#             return True

#         # Check if the user has the required permission
#         permission = getattr(view, 'permission_required', self.permission_required)
#         return request.user.has_perm(permission)
