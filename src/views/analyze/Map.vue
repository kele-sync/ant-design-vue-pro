<template>
  <page-header-wrapper>
    <a-alert message="客户打开平台分享的名片并同意获取地址，获取的定位将显示在地图上" type="success" />
    <a-card>
      <el-amap :zoom="8" vid="amapDemo" style="height:680px">
        <el-amap-marker :key="index" v-for="(marker, index) in markers" :position="marker.position"> </el-amap-marker>
      </el-amap>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'Map',
  data () {
    return {
      markers: [
        {
          position: [121.5273285, 31.21515044]
        },
        {
          position: [121.5273286, 31.21515045]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
