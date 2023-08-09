type OptionValueType = string | number

/** Select 需要的数据格式 */
export interface ISelectOption {
  value: OptionValueType
  label: string
  disabled?: boolean
}