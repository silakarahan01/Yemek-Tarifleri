# 🍳 Yemek Tarifleri Platformu

Production-ready Recipe Web App — Next.js 15 + TypeScript + Tailwind CSS

**Version:** 1.0.0
**Status:** ✅ Ready for development

---

## 🏗️ Architecture Overview

### Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + Design System
- **State:** Zustand (global) + TanStack Query (server state)
- **HTTP:** Axios (interceptors, token refresh)
- **UI:** Radix UI + Framer Motion

### Design Patterns
- **Feature-Sliced Design (FSD)** inspired directory structure
- **Atomic Design** for components
- **Clean Code** & SOLID principles
- **Optimistic updates** for mutations
- **Suspense** boundaries for async rendering

---

## 📂 Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/login, /register
│   ├── recipes/[id]             # Dynamic routes
│   ├── search/, favorites/
│   ├── layout.tsx, globals.css
│
├── components/
│   ├── atoms/                    # Primitive: Skeleton, Button
│   ├── molecules/                # Composed: RecipeCard, SearchBar
│   └── organisms/                # Complex: RecipeGrid, Header
│
├── hooks/                        # Custom React hooks
│   ├── useDebounce.ts           # Generic debounce
│   ├── useSearch.ts             # Debounced search + query params
│   ├── useFavorites.ts          # Optimistic favorites
│   └── useRecipes.ts            # TanStack Query wrapper
│
├── services/
│   ├── api/                      # Axios instance + service classes
│   │   ├── axios.instance.ts     # Interceptors, token refresh
│   │   ├── recipe.service.ts     # Recipe API calls
│   │   └── auth.service.ts
│   │
│   └── query/                    # TanStack Query configuration
│       ├── recipe.queries.ts     # Query keys, hooks
│       └── auth.queries.ts
│
├── store/                        # Zustand stores
│   ├── auth.store.ts            # User session, tokens
│   └── favorites.store.ts       # Favorite recipes (persisted)
│
├── types/                        # TypeScript definitions
│   ├── api.types.ts             # ApiResponse, ApiError
│   ├── recipe.types.ts          # Recipe, RecipeListItem
│   └── auth.types.ts            # User, AuthTokens
│
├── utils/                        # Utility functions
│   ├── formatters.ts
│   └── validators.ts
│
└── lib/                          # Configuration & setup
    ├── providers.tsx             # QueryClientProvider
    └── constants.ts              # App-wide constants
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local ve API_URL'i ayarla
```

### 3. Development Server
```bash
npm run dev
# Server başlayacak: http://localhost:3000
```

### 4. Type Check
```bash
npm run type-check
# Strict TypeScript compilation
```

### 5. Linting & Format
```bash
npm run lint
npm run format
```

---

## 📋 Key Features

### State Management

**Zustand Stores** (Global State)
```typescript
// auth.store.ts
const { user, tokens, isAuthenticated, logout } = useAuthStore()

// favorites.store.ts
const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
```

**TanStack Query** (Server State)
```typescript
// Recipe listing
const { data, isLoading } = useRecipesQuery({ search: 'pasta' })

// Recipe detail (Suspense)
<Suspense fallback={<Skeleton />}>
  <RecipeDetail id="123" />
</Suspense>
```

### API Layer (Axios)

**Request Interceptor**
- Bearer token otomatik inject
- Authentication headers

**Response Interceptor**
- 401 → Refresh token → Retry
- ApiError'a normalize
- Centralized error handling

**Token Refresh Logic**
```typescript
// axios.instance.ts
// 401 hatasında:
// 1. Access token'ı refresh et
// 2. Original request'i retry et
// 3. Hata varsa logout yap
```

### Custom Hooks

**useDebounce**
```typescript
const debouncedQuery = useDebounce(query, 300)
// 300ms delay ile debounce
```

**useSearch**
```typescript
const { query, setQuery, recipes, isLoading } = useSearch()
// Debounced search + URL query params + API call
```

**useFavorites**
```typescript
const { isFavorite, toggleFavorite, isLoading } = useFavorites()
// Zustand + API + Optimistic updates
```

### Components

**RecipeCard**
- `isLoading` prop → Skeleton render
- Favorite button (Framer Motion)
- Next/Image lazy loading
- Strict TypeScript props
- Full a11y support

```typescript
<RecipeCard
  recipe={recipe}
  isLoading={false}
  isFavorite={true}
  onFavoriteClick={toggleFavorite}
/>
```

---

## 🎨 Design System

### Colors
```typescript
// brand.ts - Primary color
brand-400: '#ed8d5f' (primary orange)
brand-500: '#e35a2b'
brand-600: '#d64a1f'

// Semantic
success: '#10b981'
warning: '#f59e0b'
error: '#ef4444'
```

### Typography
```typescript
// Font family
sans: 'Inter, system fonts'
serif: 'Georgia'
mono: 'Fira Code'

// Sizing
xs: 0.75rem
sm: 0.875rem
base: 1rem (16px)
lg: 1.125rem
...
5xl: 3rem
```

### Spacing (8px base)
```
0: 0px
1: 4px
2: 8px
4: 16px
8: 32px
16: 64px
```

---

## 🔐 Authentication Flow

1. **Login Request**
   - Axios POST `/auth/login`
   - Server returns: `{ user, tokens: { accessToken, refreshToken, expiresIn } }`

2. **Token Storage**
   - `accessToken` → localStorage (HTTP-Only cookie tercih edilir production'da)
   - `refreshToken` → localStorage

3. **Request Headers**
   - Axios request interceptor Bearer token'ı inject eder

4. **Token Refresh (401)**
   - Response interceptor'da 401 tespit
   - POST `/auth/refresh-token` ile yeni token al
   - Original request'i retry et

5. **Logout**
   - Token'ları localStorage'dan sil
   - User store'u reset et
   - Redirect to login

---

## 🧪 Type Safety

**Strict TypeScript Mode**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true
}
```

**No `any` type allowed**
- Component props kesin typed
- API responses typed
- Store state typed

---

## ⚡ Performance Optimizations

### Image Optimization
- Next/Image lazy loading
- Responsive image sizes
- WebP format support (automatic)

### Code Splitting
- Route-based splitting (Next.js default)
- Dynamic imports for heavy components
- Suspense boundaries for async rendering

### Caching Strategy
- TanStack Query: 5 min stale time (recipes), 15 min (detail)
- GC time: 10 min (recipes), 30 min (detail)
- No refetch on window focus (stable data)

### Memoization
- `React.memo()` components
- `useMemo()` for expensive calculations
- `useCallback()` for stable function refs

---

## 🎯 Development Guidelines

### Naming Conventions
```typescript
// Components
const RecipeCard = () => {}

// Hooks
const useRecipes = () => {}

// Stores
const useAuthStore = () => {}

// Services
class RecipeService {
  static async getRecipes() {}
}

// Types
interface Recipe {}
type RecipeCategory = 'breakfast' | 'lunch'
```

### File Organization
```
features/
├── components/
│   ├── RecipeCard.tsx
│   ├── RecipeCardSkeleton.tsx
│   └── index.ts
├── hooks/
│   ├── useRecipes.ts
│   └── index.ts
├── types/
│   ├── recipe.types.ts
│   └── index.ts
```

### Error Handling
```typescript
try {
  const data = await RecipeService.getRecipes()
} catch (error) {
  if (ApiError.isApiError(error)) {
    // Handle API error
    console.error(error.statusCode, error.code)
  }
}
```

---

## 📦 Build & Deployment

### Build
```bash
npm run build
# .next/ klasörü oluşturulur
```

### Production Start
```bash
npm run start
# Production server başlar (port 3000)
```

### Deployment (Vercel)
```bash
vercel --prod
# Next.js creator'u tarafından optimize edilmiş deployment
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript strict config |
| `tailwind.config.ts` | Design tokens & theme |
| `next.config.js` | Next.js optimizations |
| `postcss.config.js` | PostCSS plugins |
| `package.json` | Dependencies |
| `.env.example` | Environment template |
| `.eslintrc.json` | Linting rules |
| `.prettierrc` | Code formatting |

---

## 📚 Dependencies

### Core
- `next` - React framework
- `react`, `react-dom` - UI library
- `typescript` - Type safety

### HTTP & State
- `axios` - HTTP client
- `zustand` - State management
- `@tanstack/react-query` - Server state

### UI
- `@radix-ui/*` - Headless components
- `framer-motion` - Animations
- `tailwindcss` - Styling

---

## 🎓 Code Review Checklist

- [ ] TypeScript strict mode — no `any` type
- [ ] Props fully typed
- [ ] Error handling in place
- [ ] a11y attributes (ARIA, semantic HTML)
- [ ] No console errors/warnings
- [ ] Component memoized (if needed)
- [ ] No n+1 queries
- [ ] Toast/feedback messages
- [ ] Loading states shown
- [ ] Mobile responsive

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes + commit: `git commit -am 'Add feature'`
3. Type check: `npm run type-check`
4. Lint: `npm run lint`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

---

## 📞 Support

- **API Docs:** (backend team'den iste)
- **Design System:** Figma link
- **Issues:** GitHub Issues

---

## 📄 License

MIT

---

**Built with ❤️ by a Senior Frontend Architect**
*Production-ready. Type-safe. Performance-optimized.*
