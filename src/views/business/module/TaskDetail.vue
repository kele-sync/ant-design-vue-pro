<template>
  <a-drawer :title="title" width="400" :closable="false" :visible="visible" @close="visible = false">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="任务名称">
        <a-input
          v-decorator="['任务名称', { rules: [{ required: true, message: 'Please input your username!' }] }]"
          placeholder="Username"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="任务分类">
        <a-radio-group>
          <a-radio class="radioStyle" v-for="i in mapTaskClassify" :key="i.code" :value="i.code">
            {{ i.name }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="截至时间">
        <a-date-picker
          v-decorator="['userName', { rules: [{ required: true, message: 'Please input your username!' }] }]"
        />
      </a-form-item>
      <a-form-item label="任务备注">
        <a-textarea v-model="value" placeholder="请输入任务备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12 }">
        <a-button type="primary" html-type="submit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import { mapTaskClassify } from './TaskConfig'
const mapTitle = {
  add: '新增任务',
  edit: '编辑任务'
}

export default {
  name: 'TaskDetail',
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      mapTaskClassify,
      visible: false,
      title: mapTitle[this.mode]
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'task' })
  },
  methods: {
    openTaskDetail () {
      this.visible = true
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.radioStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
</style>
