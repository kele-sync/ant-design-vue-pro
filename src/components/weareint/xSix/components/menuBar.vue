<template>
    <a-card class="box-card" :style="{'left':x+'px','top':y+'px'}" :stop="11" @click.stop="" style="padding: 0;">
        <a-button size="small" type="danger" @click.stop="callBack('remove')">
            删除
        </a-button>
    </a-card>
</template>

<script>


  export default {
    name: "MenuBar",
    data() {
      return {
        x: '',
        y: '',
        item: {}
      };
    },
    mounted() {

    },
    methods: {
      initFn(x, y, item) {
        this.x = parseInt(x) + ''
        this.y = y + ""
        if (item) {
          this.item = item
        }

      },
      setItem(item) {
        this.item = item
      },
      callBack(type) {
        console.log(this.item, type);
        this.$emit('callBack', type, this.item)
      }
    }
  };
</script>
<style scoped>
    .box-card {
        position: absolute;
        z-index: 112;
        width: 50px;
        height: 30px;
    }

    .box-card ::v-deep .a-card__body {
        padding: 0;
    }

    .text {
        font-size: 14px;
    }

    .item {
        padding: 0;
        text-align: center;
    }

    .item:hover {
        color: #ffffff;
        background-color: #409eff;
    }

    .box-card {
        width: 105px;
    }
</style>
