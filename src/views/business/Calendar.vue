<template>
  <a-card>
    <div class="fl">
      <a-button-group >
        <a-button @click="isList = true" :type="isList ? 'primary' : ''">日历</a-button>
        <a-button @click="isList = false" :type="!isList ? 'primary' : ''">四象限</a-button>
      </a-button-group>
    </div>
    <a-calendar @select="openPlan" v-if="isList">
      <ul slot="dateCellRender" slot-scope="value" class="events">
        <li v-for="item in getListData(value)" :key="item.content">
          <a-badge :status="item.type" :text="item.content" />
        </li>
      </ul>

      <template slot="monthCellRender" slot-scope="value">

        <div v-if="getMonthData(value)" class="notes-month">
          <section>{{ getMonthData(value) }}</section>
          <span>Backlog number</span>
        </div>
      </template>
    </a-calendar>
    <div v-else>
      <a-button class="fr" type="primary" icon="plus" @click="$refs.add.openTaskDetail()">新增</a-button>
      <a-divider></a-divider>

      <classify>
      </classify>
    </div>
    <a-drawer
      title="当日安排"
      placement="right"
      width="640"
      :closable="false"
      :visible="visible"
      @close="visible = false"
    >
      <plan ref="plan"></plan>
    </a-drawer>
    <TaskDetail ref="add" mode="add"></TaskDetail>

  </a-card>
</template>
<script>
import Classify from './module/Classify.vue'
import Plan from './module/Plan.vue'
import TaskDetail from './module/TaskDetail.vue'
export default {
	components: { Plan, Classify, TaskDetail },
  data () {
   return {
      visible: false,
      isList: true
    }
  },
  methods: {
    openPlan () {
     this.visible = true
    },
    getListData (value) {
      let listData
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: '工作安排1' },
            { type: 'success', content: '工作安排2' }
          ]
          break

        default:
      }
      return listData || []
    },

    getMonthData (value) {
      if (value.month() === 8) {
        return 1394
      }
    }
  }
}
</script>
<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>
