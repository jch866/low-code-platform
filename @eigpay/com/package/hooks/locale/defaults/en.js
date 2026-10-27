export default {
  pagination: {
    pageSize: '{size}/Page',
    skip: 'Skip to',
    totalRecord: 'Total {total}'
  },
  table: {
    noData: 'No Data'
  },
  select: {
    placeholder: 'Please select',
    loading: 'Loading',
    noMatch: 'No Matching data',
    noData: 'No Data'
  },
  adress: {
    levelOnePlaceholder: 'please select a city',
    levelTwoPlaceholder: 'please select a county',
    levelThreePlaceholder: 'please select a street',
    detailPlaceholder: 'please input detail'
  },
  validation: {
    required: 'required',
    chinese: 'Must be Chinese!',
    email: 'Email illegal',
    pattern: 'Not match pattern',
    maxLength: 'Length cannot greater than {max}',
    minLength: 'Length cannot less than {min}',
    exactLength: 'Length should be {exactLength}',
    rangeLength: 'Length length should be from {min} to {max}',
    cannotLessThan: 'Value cannot less than {min}',
    cannotGreaterThan: 'Value cannot greater than {max}',
    integerFormat: 'Up to {integer}-bit integers allowed',
    decimalFormat: 'Up to {decimal}-bit decimals allowed',
    numberFormat:
      'Only up to {integer}-bit integers and {decimal}-bit decimals allowed',
    onlyAllow: 'Only allow:',
    notAllow: 'Not allow:',
    Chinese: ' Chinnese',
    digit: ' Digit',
    letter: ' English letter',
    letterLowercase: ' English lowercase letter',
    letterUppercase: ' English uppercase letter',
    whitespace: ' whitespace',
    specific: ' ?&;`\'"|*?~<>^()\\[]{}$\\n\\r',
    url: 'Invalid url',
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
        fax: "Please input digit and '-', only allow '-' presented once", //最多12位，可以输入数字和-（只允许输入一个-，不限制-出现的位置）
        id: 'Please input 9 digits starting with 1 uppercase English letter',
        phone: "Please input digit and '-', only allow '-' presented once" //最多12位，可以输入数字和-（只允许输入一个-，不限制-出现的位置）
      }
    }
  },
  datePicker: {
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    day_0: 'Sun',
    day_1: 'Mon',
    day_2: 'Tue',
    day_3: 'Wed',
    day_4: 'Thu',
    day_5: 'Fri',
    day_6: 'Sat',
    today: 'Today',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    year: '',
    month: '',
    arg_year: '{year}',
    m_0: 'Jan',
    m_1: 'Feb',
    m_2: 'Mar',
    m_3: 'Apr',
    m_4: 'May',
    m_5: 'Jun',
    m_6: 'Jul',
    m_7: 'Aug',
    m_8: 'Sep',
    m_9: 'Oct',
    m_10: 'Nov',
    m_11: 'Dec'
  },
  common: {
    cancel: 'cancel',
    confirm: 'confirm',
    now: 'now'
  },
  transfer: {
    noMatch: 'No matching data',
    noData: 'No data',
    titles: ['List 1', 'List 2'],
    filterPlaceholder: 'Enter keyword',
    noCheckedFormat: '{total} items',
    hasCheckedFormat: '{checked}/{total} checked'
  }
}
