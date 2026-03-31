from rest_framework import serializers
from .models import Recipe, Ingredient, Instruction, Nutrition


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'name', 'amount')


class InstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruction
        fields = ('id', 'step', 'description')


class NutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrition
        fields = ('calories', 'protein', 'carbs', 'fat')


class RecipeListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    total_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'category', 'difficulty',
            'prep_time', 'cook_time', 'total_time', 'servings',
            'image_url', 'rating', 'rating_count', 'author_name', 'created_at',
        )


class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)
    instructions = InstructionSerializer(many=True, read_only=True)
    nutrition = NutritionSerializer(read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)
    total_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'category', 'difficulty',
            'prep_time', 'cook_time', 'total_time', 'servings',
            'image_url', 'rating', 'rating_count', 'author_name',
            'ingredients', 'instructions', 'nutrition', 'created_at',
        )
