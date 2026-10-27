import { registryGlobalConfig } from './hooks/globalConfig'
import Button from './button'
import Form from './form'
import Input from './input'
import Radio from './radio'
import Checkbox from './checkbox'
import Switch from './switch'
import Table from './table'
import Icon from './icon'
import Pagination from './pagination'
import Select from './select'
import Breadcrumb from './breadcrumb'
import DatePicker from './datePicker'
import DatePickerApp from './datePickerApp'
import TimePicker from './timePicker'
import TableouchSlider from './touchSlider'
import Card from './card'
import Upload from './upload'
import Step from './step'
import Popover from './popover'
import Tooltip from './tooltip'
import Tree from './tree'
import Progress from './progress'
import Anchor from './anchor'
import Tab from './tab'
import Collapse from './collapse'
import Badge from './badge'
import ScrollBar from './scrollBar'
import Adress from './adress'
import Dialog from './dialog'
import Message from './message'
import Menu from './menu'
import Tag from './tag'
import Loading from './loading'
const components = [
  Button,
  Form,
  Input,
  Radio,
  Checkbox,
  Switch,
  Table,
  Icon,
  Pagination,
  Select,
  Breadcrumb,
  DatePicker,
  DatePickerApp,
  TimePicker,
  TableouchSlider,
  Card,
  Upload,
  Step,
  Popover,
  Tooltip,
  Tree,
  Progress,
  Anchor,
  Tab,
  Collapse,
  Badge,
  ScrollBar,
  Adress,
  Dialog,
  Message,
  Menu,
  Tag,
  Loading
]

const plugins = {
  install(app, options) {
    components.forEach((component) => {
      component.install(app, options)
    })
    registryGlobalConfig(options, app, true)
  }
}

export default plugins
export * from './button'
export * from './form'
export * from './input'
export * from './radio'
export * from './checkbox'
export * from './switch'
export * from './table'
export * from './icon'
export * from './pagination'
export * from './select'
export * from './breadcrumb'
export * from './datePicker'
export * from './datePickerApp'
export * from './timePicker'
export * from './touchSlider'
export * from './card'
export * from './upload'
export * from './step'
export * from './popover'
export * from './tooltip'
export * from './tree'
export * from './progress'
export * from './anchor'
export * from './tab'
export * from './collapse'
export * from './badge'
export * from './scrollBar'
export * from './adress'
export * from './dialog'
export * from './message'
export * from './menu'
export * from './tag'
export * from './loading'
