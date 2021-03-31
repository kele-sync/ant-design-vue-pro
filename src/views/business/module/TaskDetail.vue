<template>
  <a-drawer title="Two-level Drawer" width="320" :closable="false" :visible="visible" @close="visible = false">
    <a-button type="primary">
      This is two-level drawer
    </a-button>
  </a-drawer>
</template>

<script>
export default {
  name: 'TaskDetail',
  data () {
    return {
      visible: false
    }
  },
  methods: {
    openTaskDetail () {
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
