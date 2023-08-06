
// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import { request } from './utils/request2'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'
import './assets/styles/common.css'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
// import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import dataV from '@jiaminghi/data-view'
import VueAMap from 'vue-amap'
import { initGlobalComponent } from '@/components/registerComponent'
import weUtils from '@/components/weareint/weUtils'
import lodash from 'lodash'

Vue.use(dataV)
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'ebdc7dcf83b6d6d640657492323b033d',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.CitySearch', 'AMap.MarkerClusterer'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})
window._AMapSecurityConfig = {
  securityJsCode: "bdb20463db98aa4d79970a7aac801be7",
}
Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
initGlobalComponent()
Vue.prototype.$_ = lodash
Vue.prototype.$w = weUtils
Vue.prototype.$h = request
window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
