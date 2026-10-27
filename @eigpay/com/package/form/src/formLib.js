import isArray from 'lodash/isArray'
export const formContextKey = Symbol('form')
export const formItemContextKey = Symbol('formItem')

export const filterFieldsWithProps = (props, fields) => {
  return isArray(props)
    ? fields.filter((field) => field.prop && props.includes(field.prop))
    : fields
}
