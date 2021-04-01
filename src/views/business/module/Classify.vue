<template>
  <a-row :gutter="[6, 6]">
    <a-col :span="12" v-for="i in mapTaskClassify" :key="i.code">
      <a-card :title="i.name">
        <a-space direction="vertical" class="card">
          <Task v-for="i in 7" :key="i"></Task>
        </a-space>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { mapTaskClassify } from './TaskConfig'

import Task from './Task.vue'
export default {
  name: 'Classify',
  components: {
    Task
  },
  data () {
    return {
      mapTaskClassify
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  height: 220px;
  overflow: auto;
  width: 100%;
}
</style>
