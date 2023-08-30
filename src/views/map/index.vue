<template>
  <div class="map">
    <!-- <div class='header'>某某某大屏展示</div>
    <div class='footer'>
      <h5>登录</h5>
    </div> -->
    <div id="title">
      <div class="caption-title clearfix">
        <i class="title-left"><img src="../../assets/title-left.png"></i>
        <p class="title-left-title-font">退役电池回收系统</p>
        <i class="title-left"><img src="../../assets/title-right.png"></i>
      </div>
      <!-- <div class="title-date" style="height: 40px;">
        <p id="DateTime" style="height: 40px;text-align: center;">实时数据</p>
      </div> -->
    </div>
    <dv-border-box-9 class="vvv">
      <div ref="map1" style="width:350px;height:200px; "></div>
      <!-- <dv-capsule-chart :config="config" style="width:300px;height:200px;margin: 20px" /> -->
    </dv-border-box-9>
    <dv-border-box-9 class="vvvv">
      <dv-scroll-board :config="config2" style="width:365px;height:240px;" />
    </dv-border-box-9>
    <dv-decoration-11
      style="width:200px;height:60px;position: fixed;right: 20px;top: 1%;z-index: 100;font-weight: bold;color: aqua;cursor: pointer;">
      <router-link to="/system/users">退出地图模式</router-link>
    </dv-decoration-11>
    <dv-decoration-1 style="width:200px;height:50px;position: fixed;right:20px;top: 53%;z-index: 100;" />
    <div style="height:100%">
      <el-amap :zoom="12" :center="center" vid="amapDemo" mapStyle="dark">
        <custom-marker-vue :key="index" v-for="(marker, index) in markers" :position="marker.position" :msg="marker" />
        <!-- <el-amap-marker :key="index" v-for="(marker, index) in markers" :position="marker.position"> </el-amap-marker> -->
      </el-amap>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts';
import customMarkerVue from './custom-marker.vue';
export default {
  name: 'Map',
  components: {
    customMarkerVue
  },
  data() {
    return {
      config2: {
        header: ['设备编号', '在线时长'],
        data: [

        ]
      },
      config: {
        data: [
        ]
      },
      markers: [
        // {
        //   position: [121.5273285, 31.21515044]
        // },
        // {
        //   position: [121.5273286, 32.21515045]
        // }
      ],
      zoom: 12,
      // 默认中心点
      center: [116.4, 39.9],

    }
  },
  mounted() {
    this.getDtuGroup();
    this.getDtuList()
  },
  methods: {
    handleClick() {
      this.$router.push("/system/main")
    },
    formatTime(time) {
      const targetDate = new Date(time);

      // 获取当前时间
      const currentDate = new Date();

      // 计算时长（单位：毫秒）
      const duration = currentDate - targetDate;

      // 转换时长为天、小时、分钟和秒
      const days = Math.floor(duration / (1000 * 60 * 60 * 24));
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));


      return days + '天' + hours + "小时"
    },
    getDtuList() {
      this.$http.post("/api/dtu/queryListDtuInfo", {
        "devCode": ""
      }).then(({ data }) => {

        this.config2 = {
          header: ['设备编号', '在线时长'],
          data: data.map(item => {
            return [
              item.devCode, this.formatTime(item.onlineTime)
            ]
          })
        }
        console.log(this.config2.data);
        let usedPos = data.filter(item => item.lon && item.lat)
        let pos = usedPos.map(i => {
          return [i.lon, i.lat]
        })
        setTimeout(() => {
          console.log(JSON.stringify(pos));
          AMap.convertFrom(pos, 'gps', (status, result) => {
            console.log(status, result);
            if (status === 'complete' && result.info === 'ok') {
              var gcjLnglat = result.locations;  // 转换后的高德坐标
              console.log(result.locations.map(i => {
                return { position: [+i.Q, +i.R] }
              }));

              this.markers.push(...result.locations.map((i, index) => {
                return {
                  position: [+i.R, +i.
                    Q],
                  ...usedPos[index]
                }
              }));
              this.center = [result.locations[0].R, result.locations[0].Q]
              console.log(this.markers);
              console.log('转换后的高德坐标：', gcjLnglat);
            } else {
              console.log('坐标转换失败');
            }
          });
        }, 1000);

        // this.markers.push(...data.map(i => {
        //   return { position: [+i.lon, +i.lat] }
        // }));

      })
    },
    getDtuGroup() {
      this.$http.post('/api/dtu/queryDtuGroupByNetState', {
        "protocolId": 0,
        "type": 0
      }).then(({ data }) => {
        const chartContainer = this.$refs.map1;
        const myChart = echarts.init(chartContainer);
        const option = {
          xAxis: {
            max: 'dataMax'
          },
          grid: {
            top: 0,
            bottom: 0,
            left: "15%"
          },
          yAxis: {
            type: 'category',
            data: ["总数", "在线数", "离线数"],
            axisLabel: {
              color: '#fff'  // 设置字体颜色为白色
            }
          },
          series: [
            {
              name: 'X',
              type: 'bar',
              data: [
                // data.totalCount, data.onlineCount, data.offlineCount
                { name: "总数", value: +data.totalCount },
                { name: "在线数", value: +data.onlineCount },
                {
                  name: "离线数", value: +data.offlineCount
                }
              ],
              itemStyle: {
                color: '#09b9ea'  // 设置所有柱子的颜色为红色
              },
              label: {
                show: true,
                position: 'right',
              }
            }
          ],
          legend: {
            show: false
          },
        };


        myChart.setOption(option);
        this.config.data = [
          { name: "总数", value: +data.totalCount },
          { name: "在线数", value: +data.onlineCount },
          {
            name: "离线数", value: +data.offlineCount
          }
        ]

        this.$forceUpdate()

      })
    }
  }
}
</script>

<style  scoped>
.map {
  height: 100%;
}

#title {
  height: 93px;
  position: fixed;
  width: 100%;
  z-index: 100;
}

.caption-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 65px;
  max-width: 980px;
  margin: 0 auto;
}

.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.title-left img {
  width: 100%;
}

.clearfix:after {
  clear: both;
  overflow: hidden;
}

.clearfix {
  *zoom: 1;
}

@media (max-width: 767px) {
  .title-left {
    float: left;
    display: none;
  }

  .title-left-title-font {
    text-align: center;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 30px;
  }

  .box9-1 {
    display: none;
  }

  .box9-2 {
    display: block;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title-left {
    float: left;
    display: none;
  }

  .title-left-title-font {
    text-align: center;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 30px;
  }

  .box9-1 {
    display: none;
  }

  .box9-2 {
    display: block;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .title-left {
    float: left;
    display: none;
  }

  .title-left-title-font {
    float: left;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 0px;
  }

  .box9-1 {
    display: block;
  }

  .box9-2 {
    display: none;
  }
}

html,
body {
  margin: 0px;
  height: 100%;
}

html {
  font-family: sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

body {
  font-size: 62.5%;
  line-height: 1.50;
  color: #333333;
  background-color: #000c3b;
  position: relative;
  font-family: "微软雅黑";
}

.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
  overflow: hidden;
}

.clearfix {
  *zoom: 1;
}

.banner-caption {}

.title-left img {
  width: 100%;
}

@media (max-width: 767px) {
  .title-left {
    float: left;
    display: none;
  }

  .title-left-title-font {
    text-align: center;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 30px;
  }

  .box9-1 {
    display: none;
  }

  .box9-2 {
    display: block;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title-left {
    float: left;
    display: none;
  }

  .title-left-title-font {
    text-align: center;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 30px;
  }

  .box9-1 {
    display: none;
  }

  .box9-2 {
    display: block;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .title-left {
    float: left;
    display: none;
  }

  .title-left-title-font {
    float: left;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 0px;
  }

  .box9-1 {
    display: block;
  }

  .box9-2 {
    display: none;
  }
}

@media (min-width: 1200px) {
  .title-left {
    float: left;
    display: block;
  }

  .title-left-title-font {
    float: left;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 0px;
  }

  .box9-1 {
    display: block;
  }

  .box9-2 {
    display: none;
  }
}

.caption-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 65px;
  max-width: 980px;
  margin: 0 auto;
}

.data-box1 {
  border: 2px solid #032d60;
  -webkit-box-shadow: #07417a 0px 0px 10px;
  -moz-box-shadow: #07417a 0px 0px 10px;
  box-shadow: inset 0 0 30px #07417a;
  position: relative;
}

.data-title-left,
.data-title-right {
  color: #105eda;
  font-family: "微软雅黑";
  font-size: 20px;
}

.data-title {
  background-color: #000c3b;
  width: 178px;
  margin: -18px auto 0 auto;
  color: #83c7e3;
  font-size: 20px;
}

.data-title span {
  margin: 0 15px;
}

.box-bottom {
  border-bottom-width: 2px;
  border-bottom-color: #032d60;
  border-bottom-style: solid;
}

.topL {
  width: 20px;
  height: 20px;
  border-top-width: 2px;
  border-top-color: #26c6f0;
  border-top-style: solid;
  border-left-width: 2px;
  border-left-color: #26c6f0;
  border-left-style: solid;
  position: absolute;
  top: -2px;
  left: -2px;
}

.topR {
  width: 20px;
  height: 20px;
  border-top-width: 2px;
  border-top-color: #26c6f0;
  border-top-style: solid;
  border-right-width: 2px;
  border-right-color: #26c6f0;
  border-right-style: solid;
  position: absolute;
  top: -2px;
  right: -2px;
}

.bottomL {
  width: 20px;
  height: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #26c6f0;
  border-bottom-style: solid;
  border-left-width: 2px;
  border-left-color: #26c6f0;
  border-left-style: solid;
  position: absolute;
  bottom: -2px;
  left: -2px;
}

.bottomR {
  width: 20px;
  height: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #26c6f0;
  border-bottom-style: solid;
  border-right-width: 2px;
  border-right-color: #26c6f0;
  border-right-style: solid;
  position: absolute;
  bottom: -2px;
  right: -2px;
}

.panel-top {
  margin-top: 30px;
}

.box-echart {
  width: 100%;
  height: 200px;
  margin: 10px auto;
}

.box-echart-china {
  width: 92%;
  margin: 10px auto;
  height: 500px;
  position: absolute;
  top: 11%;
  left: 5%;
}

.box1-back {
  height: 600px;
  background-image: -webkit-radial-gradient(250px 250px at 50% 50%, hsla(209, 99%, 32%, 28), hsla(228, 100%, 0%, 0));
  background-image: radial-gradient(250px 250px at 50% 50%, hsla(209, 99%, 32%, 28), hsla(228, 100%, 0%, 0));
}

.panel-table {
  text-align: center;
  color: #ccc;
  margin: 0 auto !important;
  width: 96%;
  margin-top: 20px !important;
  padding: 0.5rem 0 !important;
  font-size: 1.5rem;
}

.panel-table tr {
  height: 3rem;
  line-height: 2rem;
}

.panel-table th {
  text-align: center !important;
}

.panel-table thead tr {
  border-bottom: solid 1px #a8b4be;
  border-top: solid 2px #a8b4be;
}

.data-box1-data {
  padding: 0;
  margin: 0 5%;
}

.data-box1-data li {
  float: left;
  list-style-type: none;
  margin-right: 10px;
}

.data-box1-font1 {
  color: #83c7e3;
  font-size: 2rem;
}

.data-box1-panel {
  background-color: #214398;
  color: #fff;
  font-size: 2.4rem;
  padding: 0px 2%;
  letter-spacing: 5px;
}

@media (max-width: 767px) {
  .title-date {
    margin-bottom: 20px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .title-date {
    margin-bottom: 20px;
  }
}

/*@media (min-width: 992px) and (max-width: 1199px) {
	.title-date {
		height: 5%;
	}
	.panel-box1 {
		height: 30%;
	}
}

@media (min-width: 1200px) {
	.title-date {
		height: 5%;
	}
	.panel-box1 {
		height: 30%;
	}
}*/

.title-date>p {
  color: #5b8bb6;
  /*background:linear-gradient(to bottom, #043768, #000c3b,#043768);*/
  box-shadow: inset 0 0 30px #07417a;
  border: solid 2px #032d60;
  border-radius: 10px;
  /*box-shadow:4px 2px 6px #033579, -4px -2px 6px #033579, 0px 0px 12px 5px #033579 inset;*/
  font-family: "微软雅黑";
  font-size: 2rem;
  line-height: 35px;
  line-height: 38px;
  max-width: 355px;
  margin: 5px auto;
}

.live-box {
  padding: 0;
  width: 90%;
  margin: 0 auto;
}

.live-box li {
  float: left;
  list-style-type: none;
  margin-bottom: 4%;
  font-size: 1.6rem;
  line-height: 1.4rem;
  width: 49%;
  background-color: #214398;
  color: #fff;
  padding: 2% 2% 0 2%;
}

.live-box-font1 {
  color: #f4e925;
}

.total-mn {
  font-size: 1.6rem;
  color: #fff;
  padding-left: 5%;
}

.ym-menu {
  padding: 0;
  width: 50%;
  margin: 5% auto 0 auto;
  border: 2px solid #032d60;
}

.ym-menu li {
  font-size: 1.6rem;
  color: #fff;
  width: 50%;
  text-align: center;
  list-style-type: none;
  float: left;
}

.ym-active {
  background-color: #214398;
}

.ym-active a {
  list-style-type: none;
  color: #fff;
}

.caption-title {
  font-size: 24px;
  font-weight: 900;
  line-height: 65px;
  max-width: 980px;
  margin: 0 auto;
}

@media (min-width: 1200px) {
  .title-left {
    float: left;
    display: block;
  }

  .title-left-title-font {
    float: left;
    margin: 0 10px;
    background: -webkit-linear-gradient(top, #fff, #65c4f1);
    /* 背景色渐变 */
    -webkit-background-clip: text;
    /* 规定背景的划分区域 */
    -webkit-text-fill-color: transparent;
    /* 防止字体颜色覆盖 */
  }

  .panel-bottom {
    margin-bottom: 0px;
  }

  .box9-1 {
    display: block;
  }

  .box9-2 {
    display: none;
  }
}

.header {
  background: url("../../assets/bg_top2.png")center no-repeat;
  width: 100%;
  height: 90px;
  text-align: center;
  font-size: 36px;
  color: #2a359e;
  font-weight: bold;
  line-height: 90px;
  margin: 0 auto;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}

.footer {
  width: 100%;
  height: 90px;
  background: url("../../assets/bg_btn.png") no-repeat bottom center;
  background-size: 100%;
  text-align: center;
  position: fixed;
  bottom: 0;
  z-index: 100;
}

.footer h5 {
  background-image: -webkit-linear-gradient(bottom, #86919e, #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  height: 40%;
  display: table;
  margin: auto;
  font-size: 30px;
}

.vvv {
  position: fixed;
  right: 30px;
  top: 25%;
  height: 250px;
  width: 400px;
  z-index: 100;
  padding: 20px;
}

.vvvv {
  position: fixed;
  top: 60%;
  right: 30px;
  height: 280px;
  width: 400px;
  z-index: 100;
  padding: 20px;
}
</style>
