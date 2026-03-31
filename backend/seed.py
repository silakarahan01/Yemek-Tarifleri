import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from recipes.models import Recipe, Ingredient, Instruction, Nutrition

User = get_user_model()

print("Seed verileri yükleniyor...")

# Admin kullanıcı
if not User.objects.filter(email='admin@tarifkupu.com').exists():
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@tarifkupu.com',
        password='admin123',
        name='Admin',
    )
    print("Admin kullanıcı oluşturuldu: admin@tarifkupu.com / admin123")
else:
    admin = User.objects.get(email='admin@tarifkupu.com')
    print("Admin kullanıcı zaten mevcut.")

RECIPES = [
    {
        'title': 'Menemen',
        'description': 'Geleneksel Türk kahvaltısının vazgeçilmezi, domates ve biberli yumurta yemeği.',
        'category': 'breakfast',
        'difficulty': 'easy',
        'prep_time': 10,
        'cook_time': 15,
        'servings': 2,
        'image_url': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800',
        'rating': 4.8,
        'rating_count': 234,
        'ingredients': [
            ('Yumurta', '3 adet'),
            ('Domates', '2 adet'),
            ('Yeşil biber', '2 adet'),
            ('Soğan', '1 adet'),
            ('Zeytinyağı', '2 yemek kaşığı'),
            ('Tuz', 'Tadına göre'),
            ('Karabiber', 'Tadına göre'),
        ],
        'instructions': [
            'Soğanı ince ince doğrayın ve zeytinyağında kavurun.',
            'Biberleri küp küp doğrayıp soğanlarla birlikte soteleyin.',
            'Domatesleri rendeleyin veya küp doğrayıp tavaya ekleyin.',
            'Domatesler suyunu çekince yumurtaları kırın.',
            'Yumurtaları karıştırarak pişirin, tuz ve karabiber ekleyin.',
        ],
        'nutrition': {'calories': 220, 'protein': 14.0, 'carbs': 8.0, 'fat': 15.0},
    },
    {
        'title': 'Mercimek Çorbası',
        'description': 'Türk mutfağının en sevilen çorbası, besleyici ve lezzetli kırmızı mercimek çorbası.',
        'category': 'soup',
        'difficulty': 'easy',
        'prep_time': 10,
        'cook_time': 30,
        'servings': 6,
        'image_url': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
        'rating': 4.9,
        'rating_count': 412,
        'ingredients': [
            ('Kırmızı mercimek', '2 su bardağı'),
            ('Soğan', '1 adet'),
            ('Havuç', '1 adet'),
            ('Patates', '1 adet'),
            ('Domates salçası', '1 yemek kaşığı'),
            ('Zeytinyağı', '3 yemek kaşığı'),
            ('Kimyon', '1 çay kaşığı'),
            ('Tuz', 'Tadına göre'),
        ],
        'instructions': [
            'Soğanı doğrayıp zeytinyağında kavurun.',
            'Salçayı ekleyip 2 dakika daha kavurun.',
            'Mercimek, havuç ve patatesi ekleyin.',
            '6 su bardağı su ekleyip 25-30 dakika pişirin.',
            'Blender ile pürüzsüz hale getirin ve kimyon ekleyin.',
        ],
        'nutrition': {'calories': 180, 'protein': 10.0, 'carbs': 28.0, 'fat': 4.0},
    },
    {
        'title': 'Karnıyarık',
        'description': 'Kıymalı iç harçla doldurulmuş, fırında pişirilmiş nefis patlıcan yemeği.',
        'category': 'dinner',
        'difficulty': 'medium',
        'prep_time': 20,
        'cook_time': 45,
        'servings': 4,
        'image_url': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        'rating': 4.7,
        'rating_count': 198,
        'ingredients': [
            ('Patlıcan', '4 adet'),
            ('Kıyma', '300 gram'),
            ('Soğan', '2 adet'),
            ('Domates', '2 adet'),
            ('Yeşil biber', '3 adet'),
            ('Sarımsak', '3 diş'),
            ('Zeytinyağı', '4 yemek kaşığı'),
            ('Maydanoz', '1 demet'),
        ],
        'instructions': [
            'Patlıcanları yarıya kesin, tuzlu suda 15 dakika bekletin.',
            'Kızgın yağda patlıcanları kızartın.',
            'Kıymayı soğanla kavurun, baharatları ekleyin.',
            'Patlıcanların içini açıp kıymalı harcı doldurun.',
            'Üzerine domates ve biber dilimleri koyun, fırında 30 dakika pişirin.',
        ],
        'nutrition': {'calories': 380, 'protein': 22.0, 'carbs': 18.0, 'fat': 24.0},
    },
    {
        'title': 'Baklava',
        'description': 'Antep fıstığı ve bal şerbeti ile hazırlanan Türk mutfağının en ünlü tatlısı.',
        'category': 'dessert',
        'difficulty': 'hard',
        'prep_time': 60,
        'cook_time': 40,
        'servings': 20,
        'image_url': 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=800',
        'rating': 4.9,
        'rating_count': 567,
        'ingredients': [
            ('Yufka', '500 gram'),
            ('Antep fıstığı', '300 gram'),
            ('Tereyağı', '200 gram'),
            ('Şeker', '2 su bardağı'),
            ('Su', '1.5 su bardağı'),
            ('Limon suyu', '1 yemek kaşığı'),
        ],
        'instructions': [
            'Şeker ve suyu kaynatarak şerbet hazırlayın, limon suyu ekleyin.',
            'Fıstıkları rondodan geçirin.',
            'Tepsiye yağlı yufkaları dizeyin, her katına eritilmiş tereyağı sürün.',
            'Ortasına fıstıkları yayın, kalan yufkaları üstüne koyun.',
            'Dilimleyip fırında altın rengi olana kadar pişirin, şerbet dökün.',
        ],
        'nutrition': {'calories': 420, 'protein': 7.0, 'carbs': 52.0, 'fat': 22.0},
    },
    {
        'title': 'İmam Bayıldı',
        'description': 'Zeytinyağlı, soğan ve domatesle hazırlanan klasik Türk patlıcan yemeği.',
        'category': 'lunch',
        'difficulty': 'medium',
        'prep_time': 20,
        'cook_time': 40,
        'servings': 4,
        'image_url': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        'rating': 4.6,
        'rating_count': 143,
        'ingredients': [
            ('Patlıcan', '3 adet'),
            ('Soğan', '3 adet'),
            ('Domates', '3 adet'),
            ('Sarımsak', '4 diş'),
            ('Zeytinyağı', '100 ml'),
            ('Maydanoz', '1 demet'),
            ('Tuz', 'Tadına göre'),
            ('Şeker', '1 çay kaşığı'),
        ],
        'instructions': [
            'Patlıcanları boyuna yarın, tuzlu suda çekdirin.',
            'Soğanları halka halka doğrayıp zeytinyağında kavurun.',
            'Sarımsak ve domatesleri ekleyip pişirin.',
            'Patlıcanların içine harcı doldurun.',
            'Üzerine zeytinyağı gezdirip kısık ateşte 35 dakika pişirin.',
        ],
        'nutrition': {'calories': 220, 'protein': 4.0, 'carbs': 20.0, 'fat': 14.0},
    },
    {
        'title': 'Sütlaç',
        'description': 'Fırında üzeri kızarmış, kremsi ve lezzetli Türk pirinç pudingi.',
        'category': 'dessert',
        'difficulty': 'easy',
        'prep_time': 15,
        'cook_time': 50,
        'servings': 6,
        'image_url': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
        'rating': 4.8,
        'rating_count': 289,
        'ingredients': [
            ('Pirinç', '1 su bardağı'),
            ('Süt', '1 litre'),
            ('Şeker', '1 su bardağı'),
            ('Nişasta', '3 yemek kaşığı'),
            ('Su', '2 su bardağı'),
            ('Vanilya', '1 paket'),
        ],
        'instructions': [
            'Pirinci suda haşlayın.',
            'Süt ve şekeri ayrı bir tencerede ısıtın.',
            'Nişastayı soğuk suda eritip süte ekleyin.',
            'Haşlanmış pirinci ekleyip karıştırarak pişirin.',
            'Kaselere bölüp fırında üzerini kızartın.',
        ],
        'nutrition': {'calories': 280, 'protein': 7.0, 'carbs': 52.0, 'fat': 4.0},
    },
    {
        'title': 'Tavuk Şiş',
        'description': 'Baharatlarla marine edilmiş, ızgarada pişirilmiş lezzetli tavuk şiş kebabı.',
        'category': 'dinner',
        'difficulty': 'easy',
        'prep_time': 30,
        'cook_time': 20,
        'servings': 4,
        'image_url': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        'rating': 4.7,
        'rating_count': 321,
        'ingredients': [
            ('Tavuk göğsü', '600 gram'),
            ('Yoğurt', '3 yemek kaşığı'),
            ('Zeytinyağı', '2 yemek kaşığı'),
            ('Salça', '1 yemek kaşığı'),
            ('Sarımsak', '3 diş'),
            ('Kimyon', '1 çay kaşığı'),
            ('Pul biber', '1 çay kaşığı'),
            ('Tuz ve karabiber', 'Tadına göre'),
        ],
        'instructions': [
            'Tavukları küp küp doğrayın.',
            'Yoğurt, zeytinyağı ve baharatları karıştırın.',
            'Tavukları marine sosuyla karıştırıp 2 saat bekletin.',
            'Şişlere dizerek ızgarada her tarafını pişirin.',
            'Yanında pilav veya lavaş ile servis yapın.',
        ],
        'nutrition': {'calories': 310, 'protein': 40.0, 'carbs': 5.0, 'fat': 14.0},
    },
    {
        'title': 'Cacık',
        'description': 'Sarımsaklı yoğurt, salatalık ve nane ile hazırlanan serinletici Türk mezesi.',
        'category': 'snack',
        'difficulty': 'easy',
        'prep_time': 10,
        'cook_time': 0,
        'servings': 4,
        'image_url': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800',
        'rating': 4.5,
        'rating_count': 176,
        'ingredients': [
            ('Süzme yoğurt', '500 gram'),
            ('Salatalık', '2 adet'),
            ('Sarımsak', '2 diş'),
            ('Zeytinyağı', '2 yemek kaşığı'),
            ('Kuru nane', '1 çay kaşığı'),
            ('Tuz', 'Tadına göre'),
            ('Su', 'Kıvama göre'),
        ],
        'instructions': [
            'Salatalıkları rendeleyin veya küçük küp doğrayın.',
            'Sarımsakları ezin.',
            'Yoğurt, salatalık ve sarımsağı karıştırın.',
            'Zeytinyağı, nane ve tuzu ekleyin.',
            'İstenirse su ekleyerek kıvamını ayarlayın ve soğuk servis yapın.',
        ],
        'nutrition': {'calories': 120, 'protein': 6.0, 'carbs': 8.0, 'fat': 7.0},
    },
]

Recipe.objects.all().delete()
print("Eski tarifler silindi.")

for data in RECIPES:
    recipe = Recipe.objects.create(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        difficulty=data['difficulty'],
        prep_time=data['prep_time'],
        cook_time=data['cook_time'],
        servings=data['servings'],
        image_url=data['image_url'],
        rating=data['rating'],
        rating_count=data['rating_count'],
        author=admin,
    )

    for name, amount in data['ingredients']:
        Ingredient.objects.create(recipe=recipe, name=name, amount=amount)

    for step, description in enumerate(data['instructions'], start=1):
        Instruction.objects.create(recipe=recipe, step=step, description=description)

    n = data['nutrition']
    Nutrition.objects.create(
        recipe=recipe,
        calories=n['calories'],
        protein=n['protein'],
        carbs=n['carbs'],
        fat=n['fat'],
    )

    print(f"  ✓ {recipe.title}")

print(f"\nToplam {Recipe.objects.count()} tarif yüklendi.")
print("Seed tamamlandı!")
