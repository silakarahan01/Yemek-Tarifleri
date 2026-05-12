from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Recipe
from .serializers import (
    RecipeListSerializer,
    RecipeDetailSerializer,
    RecipeWriteSerializer,
)
from .permissions import IsAuthorOrReadOnly


class RecipeListCreateView(generics.ListCreateAPIView):
    """GET /api/recipes/  — liste & filtre
    POST /api/recipes/  — yeni tarif (auth gerekir)"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RecipeWriteSerializer
        return RecipeListSerializer

    def get_queryset(self):
        queryset = Recipe.objects.select_related('author').all()
        category = self.request.query_params.get('category')
        sort = self.request.query_params.get('sort')
        q = self.request.query_params.get('q')
        author = self.request.query_params.get('author')

        if category:
            queryset = queryset.filter(category=category)

        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) | Q(description__icontains=q)
            )

        if author == 'me' and self.request.user.is_authenticated:
            queryset = queryset.filter(author=self.request.user)
        elif author and author.isdigit():
            queryset = queryset.filter(author_id=int(author))

        if sort == 'rating':
            queryset = queryset.order_by('-rating')
        elif sort == 'popular':
            queryset = queryset.order_by('-rating_count')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/PUT/DELETE /api/recipes/<id>/"""
    queryset = Recipe.objects.prefetch_related(
        'ingredients', 'instructions', 'nutrition'
    ).select_related('author')
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return RecipeWriteSerializer
        return RecipeDetailSerializer
