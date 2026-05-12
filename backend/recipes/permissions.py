from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """Sadece tarifin sahibi düzenleyebilir/silebilir; herkes okuyabilir."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author_id == getattr(request.user, 'id', None)
