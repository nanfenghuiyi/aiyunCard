// 导入需要的组件(按需引入elementUI)
import {
  Loading,
  Icon,
  Image,
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
    Vue.use(Loading)
      .use(Icon)
      .use(Image)
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