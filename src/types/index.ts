// ============================================
// 词汇相关类型定义
// ============================================

export interface Word {
  id: string | number
  user_id?: string
  original_text: string
  pronunciation?: string
  translation: string
  example?: string
  is_favorite?: boolean
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
}

export interface WordFormData {
  original_text: string
  pronunciation?: string
  translation: string
  example?: string
}

export interface WordUpdate {
  original_text?: string
  pronunciation?: string
  translation?: string
  example?: string
  is_favorite?: boolean
  updated_at?: string
}

// ============================================
// 排序选项
// ============================================

export enum SortOption {
  UPDATED_DESC = 'updated_desc',
  UPDATED_ASC = 'updated_asc',
  READING_ASC = 'reading_asc',
  READING_DESC = 'reading_desc',
  CHINESE_ASC = 'chinese_asc',
  CHINESE_DESC = 'chinese_desc'
}

// ============================================
// 语言相关类型定义
// ============================================

export interface Language {
  code: string
  name: string
  flag: string
}

export type LanguageCode = 'en' | 'zh'

export interface Translations {
  [key: string]: string
}

export interface TranslationsMap {
  en: Translations
  zh: Translations
}

// ============================================
// 主题相关类型定义
// ============================================

export interface Theme {
  id: string
  name: string
  nameCN: string
  icon: string
  description: string
}

export type ThemeId = 'modern' | 'retro' | 'neumorphism'

export interface ThemesMap {
  modern: Theme
  retro: Theme
  neumorphism: Theme
}

// ============================================
// 认证相关类型定义
// ============================================

export interface User {
  id: string
  email?: string
  user_metadata?: {
    username?: string
    display_name?: string
    deleted?: boolean
    deleted_at?: string
    status?: string
  }
}

export interface Session {
  user: User
  access_token: string
  refresh_token?: string
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthResponse {
  data: {
    user: User | null
    session: Session | null
  } | null
  error: AuthError | null
}

export interface DeleteAccountResult {
  success: boolean
  message?: string
  error?: string
  requiresAdminAction?: boolean
  deleted_words?: number
}

// ============================================
// Supabase 相关类型定义
// ============================================

export interface SupabaseConfig {
  url: string
  anonKey: string
}

export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

// ============================================
// 邮件服务相关类型定义
// ============================================

export interface EmailServiceConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

export interface VerificationEmailParams {
  to_email: string
  to_name: string
  verification_code: string
}

export interface EmailResponse {
  success: boolean
  message: string
}

// ============================================
// 组件 Props 类型定义
// ============================================

export interface WordFormProps {
  onWordAdded: () => void
}

export interface WordListProps {
  refreshTrigger: number
}

export interface WordStatsProps {
  refreshTrigger: number
}

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
}

// ============================================
// Context 类型定义
// ============================================

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
  deleteAccount: () => Promise<DeleteAccountResult>
  sendVerificationCode: (email: string, username?: string) => Promise<EmailResponse>
  verifyCode: (email: string, inputCode: string) => boolean
}

export interface LanguageContextType {
  currentLanguage: LanguageCode
  changeLanguage: (langCode: LanguageCode) => void
  t: (key: string) => string
  languages: Record<LanguageCode, Language>
}

export interface ThemeContextType {
  currentTheme: ThemeId
  changeTheme: (themeId: ThemeId) => void
  themes: ThemesMap
  isRetro: boolean
  isModern: boolean
  isClaude: boolean
}
