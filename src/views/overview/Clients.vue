<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <info title="意向客户数量" value="8个" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="尚未合作数量" value="32个" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="已合作数量" value="24个" />
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false">
      <!-- <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="城市">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="行业">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">已关注</a-select-option>
                  <a-select-option value="2">未关注</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div> -->
      <div slot="extra">
        <a-button style="margin-right:20px" type="primary">手动添加</a-button>
        <a-button style="margin-right:20px" type="primary">批量导出</a-button>
        <a-button style="margin-right:20px" type="primary">批量导入</a-button>
        <!-- <a-radio-group v-model="status">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="processing">已合作</a-radio-button>
          <a-radio-button value="waiting">未合作</a-radio-button>
        </a-radio-group> -->
        <a-input-search placeholder="请输入公司名字" style="margin-left: 16px; width: 272px;" />
      </div>

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleEdit(item)">查看详情</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a>更新沟通时间</a></a-menu-item>
                <a-menu-item><a>转至待开发客户</a></a-menu-item>
                <a-menu-item><a>添加至合作伙伴</a></a-menu-item>
                <a-menu-item @click="handleRate"><a>修改成交把握</a></a-menu-item>
                <a-menu-item @click="handleDelete()"><a>删除客户</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>联系人</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>上次沟通时间</span>
              <p>{{ item.endAt }}</p>
            </div>

            <div class="list-content-item">
              <span>联系电话</span>
              <p>15151317575</p>
            </div>
            <div class="list-content-item">
              <span>成交把握</span>
              <p>
                <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 160px" />
              </p>
            </div>
          </div>
        </a-list-item>
      </a-list>
      <a-drawer title="企业详情" placement="right" width="640" @close="visible = false" :visible="visible">
        <a-descriptions title="常州天正工业" :column="1">
          <a-descriptions-item label="域名">
            <a href="https:www.baidu.com">https:www.baidu.com</a>
          </a-descriptions-item>
          <a-descriptions-item label="备案人">
            扶工
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
          <a-descriptions-item label="上次联系时间">
            2020-1-10
          </a-descriptions-item>
          <a-descriptions-item label="电话二维码">
            <vue-qrcode value="Hello, World!" :options="{ width: 200 }"></vue-qrcode>
          </a-descriptions-item>

        </a-descriptions>
        <div>
          <a-button type="primary">
            复制信息
          </a-button>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1"> <a-icon type="user" />意向客户</a-menu-item>
              <a-menu-item key="2"> <a-icon type="user" />删除</a-menu-item>
            </a-menu>

            <a-button style="margin-left: 8px">转至 <a-icon type="down" /> </a-button>
          </a-dropdown>
        </div>
        <a-divider></a-divider>
        <div>

          <a-form-model labelAlign="left" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="备注">
              <a-input v-model="form.desc" type="textarea" :autosize="{ minRows: 6, maxRows: 8 }" />
            </a-form-model-item>
            <a-form-model-item >
              <a-button type="primary" @click="onSubmit">
                保存
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-drawer>
      <a-modal
        title="设置天正工业成交把握"
        :visible="rate.show"
        :confirm-loading="rate.confirm"
        @ok="rate.show = false"
        @cancel="rate.show=false"
      >
        <a-row>
          <a-col :span="15">
            <a-slider v-model="rate.value" :min="0" :max="100" />
          </a-col>
          <a-col :span="6" :offset="1">
            <a-input-number v-model="rate.value" :min="0" :max="100" /> %
          </a-col>
        </a-row>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from '../list/modules/TaskForm'
import Info from '../list/components/Info'
import VueQrcode from '@chenfengyuan/vue-qrcode'

const data = []
data.push({
  title: '漳县祁连山水泥有限公司',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '甘肃省兰州市安宁区西路街道九州通西路21号第2层西区',
  owner: '高国峻',
  endAt: '2018-07-26 22:44',
  count: 3,
  progress: {
    value: 90
  }
})
data.push({
  title: '漳县祁连山水泥有限公司',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '甘肃省兰州市安宁区西路街道九州通西路21号第2层西区',
  owner: '高国峻',
  endAt: '2018-07-26 22:44',
  count: 3,
  progress: {
    value: 90
  }
})
data.push({
  title: '漳县祁连山水泥有限公司',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '甘肃省兰州市安宁区西路街道九州通西路21号第2层西区',
  owner: '高国峻',
  endAt: '2018-07-26 22:44',
  count: 3,
  progress: {
    value: 90
  }
})
data.push({
  title: '漳县祁连山水泥有限公司',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '甘肃省兰州市安宁区西路街道九州通西路21号第2层西区',
  owner: '高国峻',
  endAt: '2018-07-26 22:44',
  count: 3,
  progress: {
    value: 90
  }
})

export default {
  name: 'Salesman',
  components: {
    TaskForm,
    Info,
    VueQrcode

  },
  data () {
    return {
      data,
      status: 'all',
          mdl: null,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
      visible: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return []
      },
      rate: {
        show: false,
        value: 0,
        confirm: false
      },
        form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    handleDelete () {
        this.$confirm({
        title: '确认删除当前客户？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    handleRate () {
      this.rate.show = true
    },
    add () {
      this.$dialog(TaskForm,
        // component props
        {
          record: {},
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '新增',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>
