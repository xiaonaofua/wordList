import emailjs from '@emailjs/browser'
import { EmailResponse } from '../types'

// EmailJS 配置
// 这些是公开的配置，用于发送验证码邮件
// const EMAILJS_SERVICE_ID = 'service_vocabulary'
// const EMAILJS_TEMPLATE_ID = 'template_verification'
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'

// 验证码数据接口
interface VerificationData {
  code: string
  timestamp: number
  expires: number
}

// 验证码验证结果
interface VerifyCodeResult {
  valid: boolean
  error: string | null
}

// 初始化 EmailJS
const initEmailJS = (): boolean => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY)
    return true
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error)
    return false
  }
}

// 发送验证码邮件
export const sendVerificationEmail = async (
  email: string,
  code: string,
  username: string = ''
): Promise<EmailResponse> => {
  try {
    // 创建美观的邮件内容
    const emailContent = `
📚 多语言词汇学习应用 - 验证码邮件

亲爱的 ${username || '用户'}，

欢迎注册多语言词汇学习应用！🎉

您的验证码是：
┌─────────────────┐
│   ${code}   │
└─────────────────┘

⏰ 此验证码将在10分钟后过期，请尽快完成注册。

📧 请在注册页面输入此验证码以完成账户创建。

❓ 如果您没有注册此账户，请忽略此邮件。

🌟 注册完成后，您将能够：
   • 创建个人词汇库
   • 多设备同步学习进度
   • 查看详细学习统计
   • 支持多种语言学习

祝您学习愉快！
多语言词汇学习团队

---
此邮件由系统自动发送，请勿回复。
    `

    // 在控制台显示邮件内容（开发调试用）
    console.log('=== 📧 验证码邮件 ===')
    console.log(`📮 收件人: ${email}`)
    console.log(`👤 用户名: ${username}`)
    console.log(`🔢 验证码: ${code}`)
    console.log(`📄 邮件内容:`)
    console.log(emailContent)
    console.log('====================')

    // 创建更友好的弹窗提示
    const alertMessage = `
🎉 验证码已生成！

📧 邮箱: ${email}
🔢 验证码: ${code}
⏰ 有效期: 10分钟

📝 请在注册页面输入验证码完成注册

💡 提示: 当前为演示模式
   实际应用中验证码会发送到您的邮箱

   如需配置真实邮件发送，请查看项目中的
   EMAIL_SETUP.md 文件获取详细说明
    `

    alert(alertMessage)

    // 实际的 EmailJS 发送代码（需要配置后启用）
    /*
    if (EMAILJS_PUBLIC_KEY !== 'your_public_key_here') {
      const templateParams = {
        to_email: email,
        to_name: username || '用户',
        verification_code: code,
        app_name: '多语言词汇学习应用'
      }

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )

      console.log('✅ Email sent successfully:', result)
      return { success: true, message: '验证码已发送到您的邮箱，请查收' }
    }
    */

    return {
      success: true,
      message: '验证码已生成（演示模式）'
    }

  } catch (error) {
    console.error('❌ Failed to send verification email:', error)
    return {
      success: false,
      message: '发送验证码失败，请稍后重试'
    }
  }
}

// 验证邮箱格式
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 生成验证码
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 存储验证码（本地存储，用于验证）
export const storeVerificationCode = (email: string, code: string): void => {
  const verificationData: VerificationData = {
    code,
    timestamp: Date.now(),
    expires: Date.now() + 10 * 60 * 1000 // 10分钟过期
  }

  localStorage.setItem(`verification_code_${email}`, JSON.stringify(verificationData))
}

// 验证验证码
export const verifyCode = (email: string, inputCode: string): VerifyCodeResult => {
  try {
    const stored = localStorage.getItem(`verification_code_${email}`)
    if (!stored) {
      return { valid: false, error: '验证码不存在或已过期' }
    }

    const { code, expires }: VerificationData = JSON.parse(stored)

    if (Date.now() > expires) {
      localStorage.removeItem(`verification_code_${email}`)
      return { valid: false, error: '验证码已过期，请重新获取' }
    }

    if (code !== inputCode.trim()) {
      return { valid: false, error: '验证码错误，请检查后重新输入' }
    }

    // 验证成功，清除验证码
    localStorage.removeItem(`verification_code_${email}`)
    return { valid: true, error: null }

  } catch (error) {
    console.error('Verify code error:', error)
    return { valid: false, error: '验证码验证失败' }
  }
}

// 清除过期的验证码
export const cleanupExpiredCodes = (): void => {
  const keys = Object.keys(localStorage)
  const now = Date.now()

  keys.forEach(key => {
    if (key.startsWith('verification_code_')) {
      try {
        const stored = localStorage.getItem(key)
        if (stored) {
          const data: VerificationData = JSON.parse(stored)
          if (data.expires < now) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        // 如果解析失败，删除这个键
        localStorage.removeItem(key)
      }
    }
  })
}

// 初始化邮件服务
export const initializeEmailService = (): boolean => {
  // 清理过期的验证码
  cleanupExpiredCodes()

  // 初始化 EmailJS（如果配置了的话）
  return initEmailJS()
}
