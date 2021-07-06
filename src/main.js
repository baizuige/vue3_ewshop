import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'
import { Image as VanImage, Badge, Card, Collapse, CollapseItem, Lazyload, Sidebar, SidebarItem, Swipe, SwipeItem, Tab, Tabs, Tag, Button, Form, Field, CheckboxGroup, Checkbox, SubmitBar, SwipeCell, Stepper, Icon, AddressEdit, AddressList, Popup, Grid, GridItem, PullRefresh, List } from 'vant'



createApp(App)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload, {
    loading: require('./assets/image/01.png')
  })
  .use(Badge)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Collapse)
  .use(CollapseItem)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(VanImage)
  .use(Tag)
  .use(Button)
  .use(Form)
  .use(Field)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(SubmitBar)
  .use(SwipeCell)
  .use(Stepper)
  .use(Icon)
  .use(AddressEdit)
  .use(AddressList)
  .use(Popup)
  .use(Grid)
  .use(GridItem)
  .use(PullRefresh)
  .use(List)
  .use(store).use(router).mount('#app')
