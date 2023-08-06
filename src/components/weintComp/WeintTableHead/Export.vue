<template>
  <a-tooltip placement="top">
    <template slot="title">{{ title }}</template>
    <div class="tool-item"
         v-on="$listeners">
      <we-icon name="download" />
    </div>
  </a-tooltip>
</template>

<script>
export default {
  name: 'ToolExport',
  props: {
    title: {
      type: String,
      default: '导出'
    }
  },
  data() {
    return {};
  }
};
</script>
