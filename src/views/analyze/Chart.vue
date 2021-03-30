<template>
  <page-header-wrapper>
    <a-card>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card>
            <a-statistic
              title="月新增待开发客户"
              :value="11.28"
              :precision="2"
              suffix="%"
              :value-style="{ color: '#3f8600' }"
              style="margin-right: 50px"
            >
              <template #prefix>
                <a-icon type="arrow-up" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card>
            <a-statistic
              title="月新增意向客户"
              :value="1.3"
              :precision="2"
              suffix="%"
              class="demo-class"
              :value-style="{ color: '#cf1322' }"
            >
              <template #prefix>
                <a-icon type="arrow-down" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="16" type="flex">
        <a-col :span="16">
          <div ref="client" class="chart"></div>
        </a-col>
        <a-col :span="8" class="bar-chart">
          <div class="bar" ref="cover"></div>
          <div class="bar"></div>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Chart',
  mounted () {
    setTimeout(() => {
      this.initClientChart()
      this.initCoverChart()
    }, 1)
  },
  methods: {
    initCoverChart () {
      const coverChart = echarts.init(this.$refs.cover)
      const option = {
        title: {
          text: '客户转化占比',
          subtext: 'todo',
          top: 10,
          left: 10
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          bottom: 10,
          data: (function () {
            var list = []
            for (var i = 1; i <= 28; i++) {
              list.push(i + 2000 + '')
            }
            return list
          })()
        },
        visualMap: {
          top: 'middle',
          right: 10,
          color: ['red', 'gray'],
          calculable: true
        },
        radar: {
          indicator: [
            { text: '合作伙伴数', max: 400 },
            { text: '待开发客户沟通次数', max: 400 },
            { text: '待开发用户数', max: 400 },
            { text: '意向客户数', max: 400 },
            { text: '意向客户沟通次数', max: 400 }
          ]
        },
        series: (function () {
          var series = []
          for (var i = 1; i <= 28; i++) {
            series.push({
              name: '客户转化占比',
              type: 'radar',
              symbol: 'none',
              lineStyle: {
                width: 1
              },
              emphasis: {
                areaStyle: {
                  color: 'rgba(0,250,0,0.3)'
                }
              },
              data: [
                {
                  value: [(40 - i) * 10, (38 - i) * 4 + 60, i * 5 + 10, i * 9, (i * i) / 2],
                  name: i + 2000 + ''
                }
              ]
            })
          }
          return series
        })()
      }
      coverChart.setOption(option)
    },
    initClientChart () {
      const myChart = echarts.init(this.$refs.client)
      const option = {
        title: {
          text: '季度趋势',
          subtext: 'todo',
          top: 10,
          left: 10
        },
        series: [
          {
            type: 'bar',
            name: '待开发用户',
            data: [108, 26, 39, 24],
            itemStyle: {
              borderColor: 'black',
              borderWidth: 2
            }
          },
          {
            type: 'bar',
            name: '意向用户',
            data: [23, 40, 60, 70],
            itemStyle: {
              borderColor: 'black',
              borderWidth: 2
            }
          },
          {
            type: 'bar',
            name: '合作伙伴',
            data: [129, 40, 40, 50],
            itemStyle: {
              borderColor: 'black',
              borderWidth: 2
            }
          },
          {
            type: 'bar',
            name: '名片扫码次数',
            data: [40, 60, 50, 89],
            itemStyle: {
              borderColor: 'black',
              borderWidth: 2
            }
          }
        ],
        legend: {},
        xAxis: {
          data: ['第一季度', '第二季度', '第三季度', '第四季度'],
          axisLine: {
            color: 'black'
          },
          axisTick: {
            color: 'black'
          },
          axisLabel: {
            color: 'black'
          }
        },
        yAxis: {
          axisLine: {
            color: 'black'
          },
          axisTick: {
            color: 'black'
          },
          axisLabel: {
            color: 'black'
          },
          splitLine: {
            lineStyle: {
              color: 'black',
              type: 'dashed'
            }
          }
        },

        aria: {
          decal: {
            show: true,
            decals: [
              {
                dashArrayX: 0,
                dashArrayY: 0,
                color: 'black'
              },
              {
                dashArrayX: 0,
                dashArrayY: 0,
                color: 'black'
              },
              {
                dashArrayX: [1, 0],
                dashArrayY: [2, 5],
                symbolSize: 1,
                rotation: Math.PI / 6,
                color: 'black'
              },
              {
                symbol: 'circle',
                dashArrayX: [
                  [8, 8],
                  [0, 8, 8, 0]
                ],
                dashArrayY: [6, 0],
                symbolSize: 0.8,
                color: 'black'
              }
            ]
          }
        },
        tooltip: { show: true },
        color: ['white', 'black', 'white', 'white']
      }
      myChart.setOption(option)
      window.addEventListener('resize', myChart.resize)
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  height: 500px;
  width: 100%;
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
