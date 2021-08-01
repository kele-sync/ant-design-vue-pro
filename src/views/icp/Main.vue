<template>
  <div>
    <a-row :gutter="24">
      <a-modal title="soicp会员到期日更改" :visible="visible" @ok="handleOk" @cancel="visible = false">
        <a-date-picker v-model="endDate" />
      </a-modal>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card title="续费总数" total="120">
          <template slot="footer">
            会员总数
            <span>50</span>
          </template>
        </chart-card>
      </a-col>
      <!-- <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card title="日访问量" :total="886 | NumberFormat">
          <template slot="footer">
            访问总量
            <span>{{ '1234' | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>-->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card title="soicp到期续费日" total="2022/5/5">
          <a-button class="fr" type="primary" @click="visible = true">更新会员日期</a-button>
          <template slot="footer">
            剩余天数
            <span>600天</span>
          </template>
        </chart-card>
      </a-col>
      <!-- <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card title="平台日增数据量" total="1024条">
          <template slot="footer"> 平台数据总量 <span>10000条</span> </template>
        </chart-card>
      </a-col>-->
    </a-row>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :bordered="false" title="平台近一周新增数据" :style="{ height: '100%' }">
            <div ref="data" class="chart"></div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :bordered="false" title="已开会员类型占比" :style="{ height: '100%' }">
            <div ref="vip" class="chart"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts'

import { ChartCard } from '@/components'

export default {
  name: 'Analysis',
  components: {
    ChartCard
  },
  data () {
    return {
      visible: false,
      endDate: Date.now()
    }
  },
  mounted () {
    this.initDataChart()
    this.initVipChart()
  },
  methods: {
    handleOk () {
      this.visible = false
    },
    initVipChart () {
      const myChart = echarts.init(this.$refs.vip)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: ['年度会员', '季度会员', '月度会员', '游客']
        },
        series: [
          {
            name: '用户类型',
            type: 'pie',
            radius: ['35%', '60%'],
            labelLine: {
              length: 30
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,

              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: [
              { value: 1048, name: '年度会员' },
              { value: 335, name: '季度会员' },
              { value: 310, name: '月度会员' },
              { value: 251, name: '游客' }
            ]
          }
        ]
      }
      myChart.setOption(option)
      myChart.resize()
      window.addEventListener('resize', myChart.resize)
    },
    initDataChart () {
      const chart = echarts.init(this.$refs.data)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['ICP数量', '注册用户', '会员', '日访问量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['7/6', '7/7', '7/8', '7/9', '7/10', '7/11', '7/12']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'ICP数量',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]

          },
          {
            name: '注册用户',
            type: 'line',
            data: [12, 13, 10, 13, 9, 23, 21]
          },
          {
            name: '会员',
            type: 'line',
            data: [2, 3, 1, 1, 9, 2, 1]
          },
          {
            name: '日访问量',
            type: 'line',
            data: [200, 113, 111, 100, 119, 32, 91],
                markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
          }
        ]
      }
      setTimeout(() => {
        chart.setOption(option)
        chart.resize()
      }, 10)

      window.addEventListener('resize', chart.resize)
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
	line-height: 55px;
	padding-right: 24px;

	.extra-item {
		display: inline-block;
		margin-right: 24px;

		a {
			margin-left: 24px;
		}
	}
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
	position: relative;
	display: flex;
	display: block;
	flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
	height: calc(100% - 24px);
	/deep/ .ant-card-head {
		position: relative;
	}
}

.dashboard-analysis-iconGroup {
	i {
		margin-left: 16px;
		color: rgba(0, 0, 0, 0.45);
		cursor: pointer;
		transition: color 0.32s;
		color: black;
	}
}
.analysis-salesTypeRadio {
	position: absolute;
	right: 54px;
	bottom: 12px;
}
</style>
<style lang="less" scoped>
.chart {
	height: 400px;
}
.bar-chart {
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
.bar {
	flex: 1;
}
</style>
