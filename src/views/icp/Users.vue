<template>
  <page-header-wrapper>
    <a-modal title="密码修改" :visible="visible" @ok="visible=false" @cancel="visible = false">
      <a-input placeholder="请输入新密码"></a-input>
    </a-modal>
    <a-modal
      title="到期日设置"
      :visible="dateVisible"
      @ok="dateVisible=false"
      @cancel="dateVisible = false"
    >
      <a-date-picker placeholder="请输入具体到期日" />
    </a-modal>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="账号">
                <a-input v-model="queryParam.account"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="用户类型">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option value="1">会员</a-select-option>
                  <a-select-option value="0">游客</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :sm="8">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-dropdown>
              <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item :key="i.value" v-for="i in vipGrade" :value="i.value">
                  <a-icon type="alert" />
                  {{ i.label }}
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                会员续期
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
            <a-divider type="vertical" />
            <a @click="dateVisible=true">设置到期日</a>
            <a-divider type="vertical" />
            <a @click="visible=true">重置密码</a>

            <!-- <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">

                <a-menu-item>
                  <a href="javascript:;" @click="addToDevelop()">添加至意向客户</a>
                </a-menu-item>

              </a-menu>
            </a-dropdown>-->
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getServiceList } from '@/api/manage'

const vipGrade = [
  {
    label: '一个月',
    value: '1'
  },
  {
    label: '一季度',
    value: '3'
  },
  {
    label: '一年',
    value: '4'
  }
]

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '账号',
    dataIndex: 'no'
  },
  {
    title: '用户类型',
    dataIndex: 'type'
  },
  {
    title: '续费次数',
    dataIndex: 'status'
  },
  {
    title: '会员到期日',
    dataIndex: 'updatedAt',
    sorter: true
  },
  // {
  //   title: '是否禁用',
  //   dataIndex: 'updatedAt'
  // },

  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Companys',
  components: {
    STable
  },
  data () {
    this.columns = columns
    return {
      dateVisible: false,
      vipGrade,
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
        return getServiceList(requestParameters).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: []
    }
  },

  methods: {
    handleMenuClick (i) {
      const item = vipGrade.find(item => item.value === i.key)
      this.$confirm({
        title: '操作确认',
        content: '确认续期' + item.label,
        okText: '确认',
        cancelText: '取消',
        onOk () {
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },

    handleOk () {

    }

  }
}
</script>
