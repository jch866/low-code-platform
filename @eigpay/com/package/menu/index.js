import Menu from './src/menu.vue'
import SubMenu from './src/subMenu.vue'
import MenuItem from './src/menuItem.vue'

export default {
  install(app) {
    app.component(Menu.name, Menu)
    app.component(SubMenu.name, SubMenu)
    app.component(MenuItem.name, MenuItem)
  }
}
export { Menu, SubMenu, MenuItem }
