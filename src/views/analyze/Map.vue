<template>
  <page-header-wrapper>
    <a-alert message="客户打开平台分享的名片并同意获取地址，获取的定位将显示在地图上" type="success" close-text="Close Now" />
    <a-card>
      <el-amap vid="amapDemo" style="height:680px" >
      </el-amap>
    </a-card>
  </page-header-wrapper>
</template>

<script>
	export default {
		name: 'Map'
	}
</script>

<style lang="scss" scoped>

</style>
