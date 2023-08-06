<template>
  <a-tooltip placement="top">
    <template slot="title">{{ title }}</template>
    <div class="tool-item"
         v-on="$listeners">
      <we-icon name="upload" />
    </div>
  </a-tooltip>
</template>

<script>
export default {
  name: 'ToolImport',
  props: {
    title: {
      type: String,
      default: '导入'
    }
  },
  data() {
    return {};
  },
};
</script>
