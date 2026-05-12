from rest_framework import serializers
from django.db import transaction
from .models import Recipe, Ingredient, Instruction, Nutrition


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'name', 'amount')
        extra_kwargs = {'id': {'read_only': True}}


class InstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruction
        fields = ('id', 'step', 'description')
        extra_kwargs = {'id': {'read_only': True}}


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
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    total_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'category', 'difficulty',
            'prep_time', 'cook_time', 'total_time', 'servings',
            'image_url', 'rating', 'rating_count',
            'author_id', 'author_name',
            'ingredients', 'instructions', 'nutrition', 'created_at',
        )


class RecipeWriteSerializer(serializers.ModelSerializer):
    """Yaratma ve güncelleme için nested writable serializer."""
    ingredients = IngredientSerializer(many=True)
    instructions = InstructionSerializer(many=True)
    nutrition = NutritionSerializer(required=False, allow_null=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'category', 'difficulty',
            'prep_time', 'cook_time', 'servings',
            'image_url', 'ingredients', 'instructions', 'nutrition',
        )
        extra_kwargs = {'id': {'read_only': True}}

    @transaction.atomic
    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        instructions_data = validated_data.pop('instructions', [])
        nutrition_data = validated_data.pop('nutrition', None)

        recipe = Recipe.objects.create(**validated_data)

        for ing in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ing)
        for ins in instructions_data:
            Instruction.objects.create(recipe=recipe, **ins)
        if nutrition_data:
            Nutrition.objects.create(recipe=recipe, **nutrition_data)
        return recipe

    @transaction.atomic
    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        instructions_data = validated_data.pop('instructions', None)
        nutrition_data = validated_data.pop('nutrition', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ing in ingredients_data:
                Ingredient.objects.create(recipe=instance, **ing)

        if instructions_data is not None:
            instance.instructions.all().delete()
            for ins in instructions_data:
                Instruction.objects.create(recipe=instance, **ins)

        if nutrition_data is not None:
            Nutrition.objects.update_or_create(recipe=instance, defaults=nutrition_data)

        return instance
