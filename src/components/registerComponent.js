
import WeTable from './weareint/crud/WeTable.vue';
import WeSearch from './weareint/crud/WeSearch.vue';
import WeOperation from './weareint/crud/WeOperation.vue';
import WeOperTree from './weareint/crud/WeOperTree.vue';
import WeDialog from './weareint/crud/WeDialog.vue';
import WeForm from './weareint/crud/WeForm.vue';
import WeCheckDrawer from './weareint/drawer/WeCheckDrawer';
import WeSelect from './weareint/crud/WeSelect.vue';
import WeMultiple from './weareint/crud/WeMultiple.vue';
import WeEmbed from './weareint/crud/WeEmbed.vue';
import WeTree from './weareint/tree/WeTree';
import WeTabs from './weareint/crud/WeTabs';
import WeEditTable from './weareint/crud/WeEditTable';
import WeSuInput from './weareint/crud/WeSuInput';
import WeMultipleForm from './weareint/crud/WeMultipleForm.vue';
import WeDescription from './weareint/crud/WeDescription';

import Vue from 'vue';

export function initGlobalComponent() {
  // 全局组件注册

  Vue.component('we-search', WeSearch);

  Vue.component('we-table', WeTable);

  Vue.component('we-operation', WeOperation);

  Vue.component('we-oper-tree', WeOperTree);

  Vue.component('we-dialog', WeDialog);

  Vue.component('we-form', WeForm);

  Vue.component('we-check-drawer', WeCheckDrawer);

  Vue.component('we-select', WeSelect);

  Vue.component('we-embed', WeEmbed);

  Vue.component('we-multiple', WeMultiple);

  Vue.component('we-tree', WeTree);

  Vue.component('we-tabs', WeTabs);

  Vue.component('we-edit-table', WeEditTable);

  Vue.component('we-su-input', WeSuInput);

  Vue.component('we-multiple-form', WeMultipleForm);

  Vue.component('we-description', WeDescription);
  // Vue.component('we-cron', WeCron);

  /**web2.0新组件注册 start */
  // icon
  // Vue.use(weIcon);
  // // dialog
  // Vue.use(weintDialog);
  // // weintComp文件夹下所有组件自动全局注册
  // const weintComp = require.context('./weintComp', true, /.vue$/);
  // weintComp.keys().forEach(file => {
  //   const component = weintComp(file).default;
  //   component.name && Vue.component(component.name, component);
  // });
  /**web2.0新组件注册 end */
}
