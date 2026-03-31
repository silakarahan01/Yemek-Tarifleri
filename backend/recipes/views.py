from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Recipe
from .serializers import RecipeListSerializer, RecipeDetailSerializer


class RecipeListView(generics.ListAPIView):
    serializer_class = RecipeListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Recipe.objects.select_related('author').all()
        category = self.request.query_params.get('category')
        sort = self.request.query_params.get('sort')
        q = self.request.query_params.get('q')

        if category:
            queryset = queryset.filter(category=category)

        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) | Q(description__icontains=q)
            )

        if sort == 'rating':
            queryset = queryset.order_by('-rating')
        elif sort == 'popular':
            queryset = queryset.order_by('-rating_count')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset


class RecipeDetailView(generics.RetrieveAPIView):
    queryset = Recipe.objects.prefetch_related('ingredients', 'instructions', 'nutrition').select_related('author')
    serializer_class = RecipeDetailSerializer
    permission_classes = [AllowAny]
