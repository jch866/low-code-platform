export default {
  pagination: {
    pageSize: '{size}/⾴',
    skip: '跳轉',
    totalRecord: '共{total}條數據'
  },
  table: {
    noData: '暫無數據'
  },
  select: {
    placeholder: '請選擇',
    loading: '加載中',
    noMatch: '無匹配數據',
    noData: '無數據'
  },
  adress: {
    levelOnePlaceholder: '請選擇縣市',
    levelTwoPlaceholder: '請選擇鄉鎮市',
    levelThreePlaceholder: '請選擇街道',
    detailPlaceholder: '請輸入'
  },
  validation: {
    required: '必填',
    chinese: '請輸入中文',
    email: 'Email不合法',
    pattern: '格式錯誤',
    maxLength: '長度不能大於{max}',
    minLength: '長度不能小於{min}',
    exactLength: '長度必須是{exactLength}',
    rangeLength: '長度範圍 {min} ~ {max}',
    cannotLessThan: '不可小於{min}',
    cannotGreaterThan: '不可大於{max}',
    integerFormat: '最多{integer}位的整數',
    decimalFormat: '最多{decimal}位的小數',
    numberFormat: '最多{integer}位的整數，{decimal}位的小數',
    onlyAllow: '請輸入:',
    notAllow: '不可輸入:',
    Chinese: ' 中文',
    digit: ' 數字',
    letter: ' 大小寫字母',
    letterLowercase: ' 小寫字母',
    letterUppercase: ' 大寫字母',
    whitespace: ' 空白符',
    specific: ' ?&;`\'"|*?~<>^()\\[]{}$\\n\\r',
    url: '無效url',
    twid: '請輸入起首位1個大寫英文字母與連續的9個數字',
    local: {
      common: {
        cellphone: '',
        fax: '',
        id: '',
        phone: ''
      },
      zh_TW: {
        cellphone: '',
        fax: "最多12位，允許輸入數字和'-'，'-'只允許輸入一個", //固定12位，可以输入数字和-（只允许输入一个-，不限制-出现的位置）
        id: '請輸入首位1個大寫英文字母與連續的9個數字',
        phone: "最多12位，允許輸入數字和'-'，'-'只允許輸入一個" //固定12位，可以输入数字和-（只允许输入一个-，不限制-出现的位置）
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
    confirm: '確定',
    now: '現在'
  },
  transfer: {
    noMatch: '無匹配數據',
    noData: '無數據',
    titles: ['列表 1', '列表 2'],
    filterPlaceholder: '請輸入搜索內容',
    noCheckedFormat: '共 {total} 項',
    hasCheckedFormat: '已選 {checked}/{total} 項'
  }
}
