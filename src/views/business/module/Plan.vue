<template>
  <a-drawer
    title="当日安排"
    placement="right"
    width="640"
    :closable="false"
    :visible="visible"
    @close="visible = false"
  >
    <div>
      <a-row>
        <a-col :span="12">
          <a-button type="primary" icon="plus">新增</a-button>
        </a-col>
        <a-col :span="12">
          <a-button-group class="fr">
            <a-button @click="isList = true" :type="isList ? 'primary' : ''">列表</a-button>
            <a-button @click="isList = false" :type="!isList ? 'primary' : ''">四象限</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </div>
    <a-divider />
    <a-space direction="vertical" v-if="isList">
      <Task v-for="i in 7" :key="i"></Task>
    </a-space>
    <a-row v-else :gutter="[6, 6]">
      <a-col :span="12">
        <a-card title="紧急且重要">
          <a-space direction="vertical" class="card">
            <Task v-for="i in 7" :key="i" :openTaskDetail="openTaskDetail"></Task>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="不紧急但重要">
          <a-space direction="vertical" class="card">
            <Task v-for="i in 7" :key="i"></Task>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="紧急但不重要">
          <a-space direction="vertical" class="card">
            <Task v-for="i in 7" :key="i"></Task>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="不紧急且不重要">
          <a-space direction="vertical" class="card">
            <Task v-for="i in 7" :key="i"></Task>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <a-divider />
    <a-alert message="右击任务可编辑当前任务" type="info" close-text="Close Now" />
    <task-detail ref="detail"></task-detail>
  </a-drawer>
</template>

<script>
import Task from './Task.vue'
import TaskDetail from './TaskDetail.vue'
export default {
  name: 'Plan',
  components: {
    Task,
    TaskDetail
  },
  data () {
    return {
      isList: true,
      visible: false
    }
  },
  methods: {
    openDrawer () {
      this.visible = true
    },
    openTaskDetail () {
		console.log(333)
      this.$refs.detail.openTaskDetail()
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
