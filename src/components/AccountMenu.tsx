import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './AccountMenu.css'

const AccountMenu: React.FC = () => {
  const { user, signOut, deleteAccount } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 处理登出
  const handleSignOut = async (): Promise<void> => {
    if (window.confirm(t('confirmLogout') || '确定要退出登录吗？')) {
      await signOut()
      setIsOpen(false)
    }
  }

  // 处理删除账户
  const handleDeleteAccount = async (): Promise<void> => {
    const confirmMessage = t('confirmDeleteAccount') ||
      '⚠️ 警告：删除账户将永久删除您的所有词汇数据，此操作无法撤销！\n\n确定要删除账户吗？'

    if (window.confirm(confirmMessage)) {
      const secondConfirm = t('confirmDeleteAccountSecond') ||
        '请再次确认：您真的要删除账户和所有数据吗？'

      if (window.confirm(secondConfirm)) {
        const result = await deleteAccount()

        if (result.success) {
          alert(result.message || t('accountDeleteSuccess') || '账户删除成功')
        } else {
          alert(result.error || t('accountDeleteError') || '删除账户失败')
        }
        setIsOpen(false)
      }
    }
  }

  // 获取用户显示名称
  const getUserDisplayName = (): string => {
    return user?.user_metadata?.username || user?.email || t('user') || '用户'
  }

  return (
    <div className="account-menu" ref={menuRef}>
      {/* 用户信息和菜单触发器 */}
      <button
        className="account-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="user-info">
          <span className="welcome-text">
            {t('welcome') || '欢迎'}, {getUserDisplayName()}
          </span>
          <span className="menu-arrow">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="account-dropdown">
          <div className="dropdown-header">
            <div className="user-details">
              <div className="user-avatar-large">
                <span className="avatar-icon-large">👤</span>
              </div>
              <div className="user-text">
                <div className="username">{getUserDisplayName()}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-menu">
            <button
              className="menu-item logout-item"
              onClick={handleSignOut}
            >
              <span className="menu-icon">🚪</span>
              <span className="menu-text">{t('logout') || '退出登录'}</span>
            </button>

            <button
              className="menu-item delete-account-item"
              onClick={handleDeleteAccount}
            >
              <span className="menu-icon">🗑️</span>
              <span className="menu-text">{t('deleteAccount') || '删除账户'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountMenu
