 
<template>
  <a-tabs>
    <a-tab-pane v-for="item in tabList" :key="item.label"  :tab="item.label">
      <component :is="item.component" v-bind="item.attr">

      </component>
    </a-tab-pane>
    <a-button slot="tabBarExtraContent">
      Extra Action
    </a-button>
  </a-tabs>
</template>

<script>
export default {
  name: "WeTabs",
  props: {
    tabList:Array
  },
  methods: {
    close() {

    },
    confirm() {
    
    },
  },
};
</script>

<style lang="less">

</style>

