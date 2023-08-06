<template>
  <a-drawer
    destroyOnClose
    :title="title"
    @close="handleCancel"
    closable
    :width="width"
    :dialog-style="{ top: '20px' }"
    :visible="visible"
    v-bind="attr"
    :footer="footer"
    :zIndex="500"
  >
    <slot></slot>
  </a-drawer>
</template>

<script>
export default {
  name: "WeCheckDrawer",
  props: {
    width: {
      type: String,
      default: "1200px",
    },
    title: String,
    attr:Object,
    footer:{
        type:Object,
        default: null
    }
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    openModal() {
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>