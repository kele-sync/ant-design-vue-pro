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
        <a-radio-group v-model="status">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="processing">已合作</a-radio-button>
          <a-radio-button value="waiting">未合作</a-radio-button>
        </a-radio-group>
        <a-input-search placeholder="请输入公司名字" style="margin-left: 16px; width: 272px;" />
      </div>

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="edit(item)">扫码打电话</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a>查看详情</a></a-menu-item>
                <a-menu-item><a>转至待开发客户</a></a-menu-item>
                <a-menu-item><a>标记已合作</a></a-menu-item>
                <a-menu-item><a>删除客户</a></a-menu-item>
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
              <span>沟通次数</span>
              <p>{{ item.count||0 }}次</p>
            </div>
            <div class="list-content-item">
              <span>联系电话</span>
              <p>15151317575</p>
            </div>
            <!-- <div class="list-content-item">
              <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
            </div> -->
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from '../list/modules/TaskForm'
import Info from '../list/components/Info'

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
    Info
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return []
      }
    }
  },
  methods: {
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
    edit (record) {
      console.log('record', record)
      this.$dialog(TaskForm,
        // component props
        {
          record,
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
          title: '操作',
          width: 700,
          centered: true,
          maskClosable: false
        })
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
