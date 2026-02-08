import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Button, Form, Field, CellGroup, Cell, Tabbar, TabbarItem, Card, List, PullRefresh, Search, Dialog, Toast, Tag, NavBar, Icon, ActionSheet, Popup, Picker, Swipe, SwipeItem, Grid, GridItem, Badge, Loading, Empty, Divider, Image, Tab, Tabs, Collapse, CollapseItem, NoticeBar, DropdownMenu, DropdownItem, Uploader } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Button)
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(Cell)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Card)
app.use(List)
app.use(PullRefresh)
app.use(Search)
app.use(Dialog)
app.use(Toast)
app.use(Tag)
app.use(NavBar)
app.use(Icon)
app.use(ActionSheet)
app.use(Popup)
app.use(Picker)
app.use(Swipe)
app.use(SwipeItem)
app.use(Grid)
app.use(GridItem)
app.use(Badge)
app.use(Loading)
app.use(Empty)
app.use(Divider)
app.use(Image)
app.use(Tab)
app.use(Tabs)
app.use(Collapse)
app.use(CollapseItem)
app.use(NoticeBar)
app.use(DropdownMenu)
app.use(DropdownItem)
app.use(Uploader)

app.mount('#app')
