
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="城市">
                <a-cascader :options="options" placeholder="请选择城市" @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">企业</a-select-option>
                  <a-select-option value="2">单位</a-select-option>
                  <a-select-option value="3">事业单位</a-select-option>
                  <a-select-option value="4">社会团体</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">

              <a-col :md="8" :sm="24">
                <a-form-item label="单位名称">
                  <a-input v-model="queryParam.id" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="8" :sm="24">
                <a-form-item label="网站状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->

            </template>
            <a-col :sm="8">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />添加至待开发客户</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">查看详情</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="addToDevelop()">添加至待开发客户</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="addToDevelop()">添加至意向客户</a>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </s-table>
      <a-drawer
        title="企业详情"
        placement="right"
        width="640"
        @close="visible=false"
        :visible="visible"
      >
        <a-descriptions title="常州天正工业" :column="1">
          <a-descriptions-item label="域名">
            <a href="https:www.baidu.com">https:www.baidu.com</a>
          </a-descriptions-item>
          <a-descriptions-item label="法定代表人">
            扶工
          </a-descriptions-item>
          <a-descriptions-item label="电话号码">
            15151317576
          </a-descriptions-item>
          <a-descriptions-item label="邮箱地址">
            chj.ymh@outlook.com
          </a-descriptions-item>
          <a-descriptions-item label="网站名称">
            天正工业官网
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            2020-1-10
          </a-descriptions-item>
          <a-descriptions-item label="注册地址">
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </a-descriptions-item>
          <a-descriptions-item label="注册资金">
            1w淫民币
          </a-descriptions-item>
          <a-descriptions-item label="企业类型">
            有限责任公司
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            在业
          </a-descriptions-item>
          <a-descriptions-item label="经营范围">
            通用设备，重金属
          </a-descriptions-item>
          <a-descriptions-item label="统一社会信用代码">
            123123
          </a-descriptions-item>

        </a-descriptions>
        <div>
          <a-button type="primary">
            复制信息
          </a-button>
          <a-dropdown>
            <a-menu slot="overlay" >
              <a-menu-item key="1"> <a-icon type="user" />待开发用户</a-menu-item>
              <a-menu-item key="2"> <a-icon type="user" />意向客户</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">收藏至 <a-icon type="down" /> </a-button>
          </a-dropdown>
          <a-button type="dashed" style="margin-left: 8px">
            扫码打电话
          </a-button>
        </div>
      </a-drawer>

    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import cascaderAddressOptions from './cascader-address-options'

import StepByStepModal from '../list/modules/StepByStepModal'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '域名',
    dataIndex: 'no'
  },
  {
    title: '单位名称',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '备案人',
    dataIndex: 'callNo',
    sorter: true,
    customRender: (text) => text + ' 次'
  },
  {
    title: '网站名称',
    dataIndex: 'callN',
    sorter: true,
    customRender: (text) => text + ' 次'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '备案时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'Companys',
  components: {
    STable,
    Ellipsis,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters)
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: cascaderAddressOptions
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
    console.log(cascaderAddressOptions)
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
    },
    addToDevelop () {
         this.$message.info('已添加至待开发客户')
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
