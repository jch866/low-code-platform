export default {
  pagination: {
    pageSize: '{size}/页',
    skip: '跳至',
    totalRecord: '共{total}条数据'
  },
  table: {
    noData: '暂无数据'
  },
  select: {
    placeholder: '请选择',
    loading: '加载中',
    noMatch: '无匹配数据',
    noData: '无数据'
  },
  adress: {
    levelOnePlaceholder: '请选择县市',
    levelTwoPlaceholder: '请选择乡镇市',
    levelThreePlaceholder: '请选择街道',
    detailPlaceholder: '请输入'
  },
  validation: {
    required: '必填',
    chinese: '请输入中文',
    email: 'Email不合法',
    pattern: '格式错误',
    maxLength: '长度不能大于{max}',
    minLength: '长度不能小于{min}',
    exactLength: '长度必须是{exactLength}',
    rangeLength: '长度范围 {min} ~ {max}',
    cannotLessThan: '不可小于{min}',
    cannotGreaterThan: '不可大于{max}',
    integerFormat: '最多{integer}位的整数',
    decimalFormat: '最多{decimal}位的小数',
    numberFormat: '最多{integer}位的整数, {decimal}位的小数',
    onlyAllow: '请输入:',
    notAllow: '不可输入:',
    Chinese: ' 中文',
    digit: ' 数字',
    letter: ' 大小写字母',
    letterLowercase: ' 小写字母',
    letterUppercase: ' 大写字母',
    whitespace: ' 空白符',
    specific: ' ?&;`\'"|*?~<>^()\\[]{}$\\n\\r',
    url: '无效url',
    twid: '请输入起首位1个大写英文字母与连续的9个数字',
    local: {
      common: {
        cellphone: '',
        fax: '',
        id: '',
        phone: ''
      },
      zh_TW: {
        cellphone: '',
        fax: "最多12位，允许输入数字和'-'， '-'只允许输入一个", //固定12位，可以输入数字和-（只允许输入一个-，不限制-出现的位置）
        id: '请输入首位1个大写英文字母与连续的9个数字',
        phone: "最多12位，允许输入数字和'-'， '-'只允许输入一个" //固定12位，可以输入数字和-（只允许输入一个-，不限制-出现的位置）
      }
    }
  },
  datePicker: {
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
    day_0: '日',
    day_1: '一',
    day_2: '二',
    day_3: '三',
    day_4: '四',
    day_5: '五',
    day_6: '六',
    today: '今天',
    january: '一',
    february: '二',
    march: '三',
    april: '四',
    may: '五',
    june: '六',
    july: '七',
    august: '八',
    september: '九',
    october: '十',
    november: '十一',
    december: '十二',
    year: '年',
    month: '月',
    arg_year: '{year}年',
    m_0: '一月',
    m_1: '二月',
    m_2: '三月',
    m_3: '四月',
    m_4: '五月',
    m_5: '六月',
    m_6: '七月',
    m_7: '八月',
    m_8: '九月',
    m_9: '十月',
    m_10: '十一月',
    m_11: '十二月'
  },
  common: {
    cancel: '取消',
    confirm: '确定',
    now: '现在'
  },
  transfer: {
    noMatch: '无匹配数据',
    noData: '无数据',
    titles: ['列表 1', '列表 2'],
    filterPlaceholder: '请输入搜索内容',
    noCheckedFormat: '共 {total} 项',
    hasCheckedFormat: '已选 {checked}/{total} 项'
  }
}
