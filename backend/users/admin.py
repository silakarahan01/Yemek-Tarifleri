from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'is_staff', 'date_joined')
    search_fields = ('email', 'name')
    ordering = ('-date_joined',)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Ek Bilgiler', {'fields': ('name',)}),
    )
