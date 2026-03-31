from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from recipes.models import Recipe
from recipes.serializers import RecipeListSerializer
from .models import Favorite


class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related('recipe__author')
        recipes = [f.recipe for f in favorites]
        serializer = RecipeListSerializer(recipes, many=True)
        return Response(serializer.data)


class FavoriteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            return Response({'detail': 'Tarif bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

        favorite, created = Favorite.objects.get_or_create(user=request.user, recipe=recipe)

        if not created:
            favorite.delete()
            return Response({'favorited': False, 'message': 'Favorilerden kaldırıldı.'})

        return Response({'favorited': True, 'message': 'Favorilere eklendi.'}, status=status.HTTP_201_CREATED)

    def delete(self, request, recipe_id):
        Favorite.objects.filter(user=request.user, recipe_id=recipe_id).delete()
        return Response({'favorited': False, 'message': 'Favorilerden kaldırıldı.'})
