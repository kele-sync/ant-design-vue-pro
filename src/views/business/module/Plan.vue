<template>
  <div>
    <div>
      <a-row>
        <a-col :span="12">
          <a-button type="primary" icon="plus" @click="$refs.add.openTaskDetail()">新增</a-button>
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
    <Classify v-else></Classify>
    <a-divider />
    <a-alert message="右击任务可编辑当前任务" type="info" close-text="Close Now" />
    <TaskDetail ref="add" mode="add"></TaskDetail>
  </div>
</template>

<script>
import Classify from './Classify.vue'
import Task from './Task.vue'
import TaskDetail from './TaskDetail.vue'
export default {
  name: 'Plan',
  components: {
    Task,
    TaskDetail,
    Classify
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
     this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
