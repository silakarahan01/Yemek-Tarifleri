from django.contrib import admin
from .models import Recipe, Ingredient, Instruction, Nutrition


class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1


class InstructionInline(admin.TabularInline):
    model = Instruction
    extra = 1


class NutritionInline(admin.StackedInline):
    model = Nutrition
    extra = 0
    max_num = 1


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'rating', 'author', 'created_at')
    list_filter = ('category', 'difficulty')
    search_fields = ('title', 'description')
    inlines = [IngredientInline, InstructionInline, NutritionInline]
    readonly_fields = ('created_at', 'updated_at')
