// 导入需要的组件(按需引入elementUI)
import {
  Drawer,
  RadioGroup,
  Loading,
  CollapseItem,
  Radio,
  Collapse,
  backtop,
  Icon,
  Image,
  Rate,
  Tabs,
  TabPane,
  InfiniteScroll,
  Table,
  tableColumn,
  Pagination,
  Upload,
  DropdownItem,
  Dropdown,
  DropdownMenu
} from 'element-ui';

const element = {
  install: function (Vue) {
    Vue.use(Drawer)
      .use(RadioGroup)
      .use(Loading)
      .use(CollapseItem)
      .use(Radio)
      .use(Collapse)
      .use(backtop)
      .use(Icon)
      .use(Image)
      .use(Rate)
      .use(Tabs)
      .use(TabPane)
      .use(InfiniteScroll)
      .use(Table)
      .use(tableColumn)
      .use(Pagination)
      .use(Upload)
      .use(DropdownItem)
      .use(Dropdown)
      .use(DropdownMenu)
  }
}
export default element