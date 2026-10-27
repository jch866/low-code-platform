import pattern from './pattern'
import { useLocale } from '../../../hooks/locale'
const { t } = useLocale()
const regexp = /^[\u4e00-\u9fa5]*$/
const message = () => t('validation.chinese')
const makeProxy = () => {
  const proxy = pattern()
  proxy.pattern(regexp).message(message)
  return proxy
}
export default makeProxy
