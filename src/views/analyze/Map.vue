<template>
  <page-header-wrapper>
    <a-alert message="客户打开平台分享的名片并同意获取地址，获取的定位将显示在地图上" type="success" />
    <a-card>
      <el-amap :zoom="24" vid="amapDemo" style="height:680px" mapStyle='fresh'>
        <el-amap-marker :key="index" v-for="(marker, index) in markers" :position="marker.position"> </el-amap-marker>
      </el-amap>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'Map',
  data() {
    const that = this
    return {
      markers: [
        {
          position: [121.5273285, 31.21515044]
        },
        {
          position: [121.5273286, 31.21515045]
        }
      ],
      zoom: 24,
      // 默认中心点
      center: [116.4, 39.9],
      // 当前地图的插件
      plugin: [
        {
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
          showMarker: false, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: 'all',
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              console.log(333)
              o.setMapStyle('amap://styles/darkblue')
              o.Geolocation((status, result) => {
                console.log(result)
                if (result && result.position) {
                  // 将当前经纬度给中心点
                  that.center = [result.position.lng, result.position.lat]
                  // 将当前经纬度给标记点
                  that.markers[0].position = that.center
                  that.loaded = true
                  that.$nextTick()
                }
              })
            }
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
