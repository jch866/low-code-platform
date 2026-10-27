import pattern from './pattern'
import { useLocale } from '../../../hooks/locale'
const { t } = useLocale()
const regexp = /^([A-Z][0-9]{9,9})?$/
const message = () => t('validation.twid')
const makeProxy = () => {
  const proxy = pattern()
  proxy.pattern(regexp).message(message)
  return proxy
}
export default makeProxy
