# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

多語言詞彙學習應用 - 支持雲端同步的詞彙管理系統，使用 React + Supabase 構建，部署在 GitHub Pages。

**Live URL**: https://xiaonaofua.github.io/wordList/

## Development Commands

```bash
# 开发服务器 (http://localhost:5173)
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 部署到 GitHub Pages
npm run deploy
```

## Architecture Overview

### Core Technology Stack

- **React 19.0.0** - UI framework
- **Vite 6.3.5** - Build tool (base: `/wordList/`)
- **Supabase** - Cloud database + authentication
- **Pure CSS3** - No external UI frameworks

### Storage Architecture (Dual-Strategy Pattern)

所有数据操作通过 `src/utils/wordStorage.js` 统一管理，自动在云端/本地存储间切换：

```javascript
// 存储抽象层
if (useCloudStorage()) {
  return await supabaseStorage.method()
} else {
  return localStorage.method()
}
```

**Storage Implementations**:
- `src/utils/supabaseStorage.js` - Cloud storage (Supabase)
- `src/utils/localWordStorage.js` - Local storage (localStorage)

**Key Functions**:
- `getAllWords()`, `addWord()`, `updateWord()`, `deleteWord()`
- `toggleWordFavorite()`, `getSortedWords()`
- Auto-fallback: Cloud failure → Local storage

### Authentication System

**Entry Point**: `src/contexts/AuthContext.jsx`

**Flow**:
1. Register: Email → 6-digit verification code → Password
2. Login: Email + Password → JWT Token
3. Session: Auto-refresh via Supabase
4. Data Isolation: Row Level Security (RLS)

**Key Functions**:
- `signUp()`, `signIn()`, `signOut()`, `deleteAccount()`
- `sendVerificationCode()`, `verifyCode()`

**Email Service**: `src/services/emailService.js` (EmailJS integration)

### Context System (React Context API)

Three global contexts provide app-wide state:

1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - User authentication state
   - `useAuth()` → `{ user, loading, signIn, signOut, ... }`

2. **LanguageContext** (`src/contexts/LanguageContext.jsx`)
   - i18n support (en/zh)
   - `useLanguage()` → `{ t, currentLanguage, changeLanguage }`

3. **ThemeContext** (`src/contexts/ThemeContext.jsx`)
   - Theme switching (modern/retro)
   - `useTheme()` → `{ currentTheme, changeTheme, isRetro }`

### Component Hierarchy

```
App.jsx (Context Providers: Theme → Language → Auth)
├── AppContent (Auth-gated)
│   ├── Header
│   │   ├── LanguageSelector
│   │   ├── ThemeSelector
│   │   └── AccountMenu
│   ├── Main
│   │   ├── WordForm (添加词汇)
│   │   ├── WordList (词汇列表 + 搜索)
│   │   └── WordStats (统计信息)
│   └── Footer
└── Auth (Login/Register UI)
```

**Key Props Pattern**:
- `refreshTrigger` - Counter for triggering list refresh
- `onWordAdded={() => setRefreshTrigger(prev => prev + 1)}`

### Database Schema (Supabase)

**Table**: `words` (configured in `src/lib/supabase.js`)

```sql
CREATE TABLE words (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  original_text TEXT NOT NULL,
  pronunciation TEXT,
  translation TEXT NOT NULL,
  example TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Row Level Security
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own words" ON words
  FOR ALL USING (auth.uid() = user_id);
```

**Supabase Config**: Pre-configured in `src/lib/supabase.js`
- URL: `https://dcqhsrwojhpoynahkewp.supabase.co`
- Anonymous key is committed (public, RLS-protected)

### Styling System

**CSS Variables Architecture**:
- `src/App.css` - Modern theme (default)
- `src/styles/retro-theme.css` - Windows 98 theme

**Theme Switching**:
```javascript
document.body.className = `theme-${currentTheme}`
document.body.setAttribute('data-theme', currentTheme)
```

**Responsive Breakpoints**:
- Mobile: < 768px
- Tablet: ≥ 768px
- Desktop: ≥ 1024px

## Key Implementation Details

### Search Functionality

Client-side search implemented in `WordList.jsx`:
```javascript
words.filter(word =>
  word.original_text?.toLowerCase().includes(searchTerm) ||
  word.pronunciation?.toLowerCase().includes(searchTerm) ||
  word.translation?.toLowerCase().includes(searchTerm) ||
  word.example?.toLowerCase().includes(searchTerm)
)
```

### Favorite Priority Display

收藏的词汇优先显示 (implemented in `WordList.jsx`):
```javascript
const sortedWords = [...allWords].sort((a, b) => {
  if (a.is_favorite && !b.is_favorite) return -1
  if (!a.is_favorite && b.is_favorite) return 1
  return new Date(b.updated_at) - new Date(a.updated_at)
})
```

### Error Boundary

所有主要组件使用 `ErrorBoundary` 包裹 (`src/components/ErrorBoundary.jsx`)

### Deployment Configuration

**Vite Config** (`vite.config.js`):
```javascript
base: '/wordList/',  // GitHub Pages subdirectory
build: {
  outDir: 'dist',
  assetsDir: 'assets'
}
```

**GitHub Pages**: `npm run deploy` → `gh-pages -d dist`

## Common Development Tasks

### Adding New Translation Keys

1. Add keys to both `en` and `zh` in `src/contexts/LanguageContext.jsx`
2. Use in components: `const { t } = useLanguage()` → `{t('yourKey')}`

### Adding New Storage Methods

1. Implement in both `supabaseStorage.js` and `localWordStorage.js`
2. Add abstraction layer in `wordStorage.js` with auto-fallback

### Modifying Authentication Flow

- Main logic in `src/contexts/AuthContext.jsx`
- UI components in `src/components/Auth.jsx`
- Email service in `src/services/emailService.js`

### Theme Customization

- Modern theme: Modify CSS variables in `:root` (App.css)
- Retro theme: Modify `.theme-retro` (styles/retro-theme.css)

## TypeScript Migration Status

**Current Status**: ✅ **100% Complete**

**All files converted to TypeScript**:
- ✅ TypeScript 5.9.3 installed and configured
- ✅ `tsconfig.json` with strict mode enabled
- ✅ Complete type system in `src/types/index.ts` (45+ types)
- ✅ All utils files converted (5 files)
- ✅ All services files converted (1 file)
- ✅ All lib files converted (1 file)
- ✅ All contexts converted (3 files)
- ✅ All components converted (10 files)
- ✅ Main app files converted (App.tsx, main.tsx)

**Verification**:
- ✅ TypeScript type check: Zero errors (`npx tsc --noEmit`)
- ✅ Production build: Success (1.96s, 105.66 kB gzipped)
- ✅ All functionality preserved

**See `TYPESCRIPT_MIGRATION_COMPLETE.md` for**:
- Complete conversion report
- Type safety improvements
- Statistics and verification results

## Important Notes

- **Base Path**: All routes must account for `/wordList/` base (GitHub Pages)
- **Authentication**: RLS ensures data isolation, anonymous key is safe to commit
- **Storage**: Always use `wordStorage.ts` abstraction, never direct storage calls
- **i18n**: All user-facing text must be translated (en/zh)
- **Responsive**: Mobile-first design, test on all breakpoints
- **Type Safety**: Use types from `src/types/index.ts` for all new code
