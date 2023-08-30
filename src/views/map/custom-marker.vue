<template>
  <div class="custom-marker">
    <img src="@/assets/p2.png" alt="" style="width: 30px;" @click="msgVisible = true" v-if="msg.netState">
    <img src="@/assets/p1.png" alt="" style="width: 30px;" @click="msgVisible = true" v-else>
    <a-modal title="电池信息" :visible="msgVisible" :footer="null" @ok="msgVisible = false" @cancel="msgVisible = false">
      <a-table :columns="columns" :data-source="tableData" :pagination="false" :showHeader="false">

      </a-table>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'CustomMarker',
  data() {
    return {
      msgVisible: false,
      columns: [
        {
          title: 'name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'value',
          dataIndex: 'value',
          key: 'value',
        },
      ],
    }
  },
  computed: {
    tableData() {
      return [
        { name: "设备编号", value: this.msg.devCode },
        { name: "电池状态", value: this.msg.netState ? "在线" : "离线" },

      ]
    }
  },
  props: ['position', "msg"], // 接收传入的marker位置信息
  mounted() {
    // 在组件挂载后，可以进行自定义marker的相关操作，例如绑定事件等
    // 使用高德地图API创建自定义marker
    const marker = new AMap.Marker({
      position: this.position,
      content: this.$el // 使用自定义marker组件的内容作为marker的展示
    });
    // 将marker添加到地图上
    this.$parent.$amap.add(marker);
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.$http.post("/api/customer/queryParamsValueByDtu", {
        "devCode": this.msg.devCode
      }).then(({ data }) => {
        console.log(data);
        if (data && data.length) {
          data.forEach(item => {
            console.log(item.paramId);
            if (item.paramId == "1816") {
              this.tableData.push({
                name: "电池组总电压", value: item.value
              })
              // this.$set(this.msg, "zdy", item.value)
            }
            if (item.paramId == "1867") {
              this.tableData.push({
                name: "总有功电量H", value: item.value
              })
              // this.$set(this.msg, "zdl", item.value)
            }
            if (item.paramId == "1869") {
              this.tableData.push({
                name: "有功功率H", value: item.value
              })
              // this.$set(this.msg, "gl", item.value)
            }
            if (item.paramId == "1871") {
              this.tableData.push({
                name: "电流H", value: item.value
              })
              // this.$set(this.msg, "dl", item.value)
            }
          })
        }
        this.tableData.push(...[{ name: "simIccid", value: this.msg.simIccid },
        { name: "simImei", value: this.msg.simImei },
        { name: "simImsi", value: this.msg.simImsi },])
      })
    }
  },
  destroyed() {
    // 在组件销毁前，可以进行清理工作，例如移除marker
    // this.$parent.$map.remove(this.marker);
  }
};
</script>

<style scoped>
.custom-marker {
  /* 自定义marker的样式 */
  /* 例如，设置宽度、高度、背景颜色等 */
}
</style>
