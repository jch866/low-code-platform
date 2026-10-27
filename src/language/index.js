import { createI18n } from 'vue-i18n'
import zh_cn from './locales/zh'
import zh_tw from './locales/zh_tw'
import en_us from './locales/en_us'

const i18n = createI18n({
  locale: 'zh_cn', // 默认使用的语言
  fallbackLocale: 'zh_tw', //词条匹配不到时的回退语言
  messages: {
    zh_cn,
    zh_tw,
    en_us
  }
})

export default i18n
