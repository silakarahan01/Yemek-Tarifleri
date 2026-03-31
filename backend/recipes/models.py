from django.db import models
from django.conf import settings


class Category(models.TextChoices):
    BREAKFAST = 'breakfast', 'Kahvaltı'
    LUNCH = 'lunch', 'Öğle Yemeği'
    DINNER = 'dinner', 'Akşam Yemeği'
    DESSERT = 'dessert', 'Tatlı'
    SNACK = 'snack', 'Ara Sıcak'
    SOUP = 'soup', 'Çorba'
    SALAD = 'salad', 'Salata'


class Difficulty(models.TextChoices):
    EASY = 'easy', 'Kolay'
    MEDIUM = 'medium', 'Orta'
    HARD = 'hard', 'Zor'


class Recipe(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.DINNER)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    prep_time = models.PositiveIntegerField(help_text='Dakika cinsinden hazırlık süresi')
    cook_time = models.PositiveIntegerField(help_text='Dakika cinsinden pişirme süresi')
    servings = models.PositiveIntegerField(default=4)
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='recipes')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    rating_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def total_time(self):
        return self.prep_time + self.cook_time


class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    name = models.CharField(max_length=200)
    amount = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.amount} {self.name}'


class Instruction(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='instructions')
    step = models.PositiveIntegerField()
    description = models.TextField()

    class Meta:
        ordering = ['step']

    def __str__(self):
        return f'Adım {self.step}: {self.description[:50]}'


class Nutrition(models.Model):
    recipe = models.OneToOneField(Recipe, on_delete=models.CASCADE, related_name='nutrition')
    calories = models.PositiveIntegerField(default=0)
    protein = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    carbs = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    fat = models.DecimalField(max_digits=5, decimal_places=1, default=0)

    def __str__(self):
        return f'{self.recipe.title} - Besin Değerleri'
